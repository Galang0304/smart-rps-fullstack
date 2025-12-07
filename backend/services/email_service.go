package services

import (
	"fmt"
	"net/smtp"
	"strings"

	"github.com/syrlramadhan/dokumentasi-rps-api/config"
)

type EmailService struct {
	smtpHost     string
	smtpPort     string
	senderEmail  string
	senderPasswd string
}

func NewEmailService() *EmailService {
	es := &EmailService{
		smtpHost:     config.GetEnv("SMTP_HOST", "smtp.gmail.com"),
		smtpPort:     config.GetEnv("SMTP_PORT", "587"),
		senderEmail:  config.GetEnv("SMTP_USERNAME", "unismuhrps@gmail.com"),
		senderPasswd: config.GetEnv("SMTP_PASSWORD", ""),
	}

	if es.senderPasswd == "" {
		fmt.Println("[EmailService] WARNING: SMTP_PASSWORD is empty, email will not be sent")
	} else {
		fmt.Printf("[EmailService] SMTP configured for %s:%s as %s\n", es.smtpHost, es.smtpPort, es.senderEmail)
	}

	return es
}

func (es *EmailService) SendDosenAccountEmail(toEmail, namaLengkap, username, password string) error {
	fmt.Printf("[EmailService] Sending dosen account email to %s (username=%s)\n", toEmail, username)
	subject := "Akun Dosen SMART RPS - Unismuh Makassar"

	body := fmt.Sprintf(`
Yth. %s

Selamat datang di SMART RPS Universitas Muhammadiyah Makassar!

Akun dosen Anda telah berhasil dibuat. Berikut detail akun Anda:

Username: %s
Password: %s
Email: %s

Silakan login ke sistem SMART RPS untuk mengelola Rencana Pembelajaran Semester (RPS) Anda.
Anda dapat mengakses mata kuliah yang telah diberikan oleh program studi.

PENTING: 
- Harap ganti password Anda setelah login pertama kali
- Jangan bagikan informasi akun Anda kepada orang lain
- Simpan username dan password Anda dengan aman

Jika ada pertanyaan, silakan hubungi administrator sistem.

Terima kasih.

---
SMART RPS System
Universitas Muhammadiyah Makassar
`, namaLengkap, username, password, toEmail)

	message := []byte(fmt.Sprintf("Subject: %s\r\n\r\n%s", subject, body))

	auth := smtp.PlainAuth("", es.senderEmail, es.senderPasswd, es.smtpHost)

	err := smtp.SendMail(
		es.smtpHost+":"+es.smtpPort,
		auth,
		es.senderEmail,
		[]string{toEmail},
		message,
	)

	if err != nil {
		fmt.Println("[EmailService] ERROR sending dosen email:", err.Error())
		return fmt.Errorf("gagal mengirim email: %v", err)
	}

	fmt.Println("[EmailService] Dosen account email sent successfully")
	return nil
}

// SendKaprodiAccountEmail mengirim email berisi akun kaprodi saat prodi dibuat
func (es *EmailService) SendKaprodiAccountEmail(toEmail, namaKaprodi, username, password string) error {
	fmt.Printf("[EmailService] Sending kaprodi account email to %s (username=%s)\n", toEmail, username)
	subject := "Akun Kaprodi SMART RPS - Unismuh Makassar"

	body := fmt.Sprintf(`
Yth. %s

Akun Kaprodi SMART RPS Anda telah berhasil dibuat.

Berikut detail akun Anda:

Username: %s
Password: %s
Email: %s

Dengan akun ini Anda dapat:
- Mengelola Program Studi dan mata kuliah
- Menugaskan dosen dan memberikan akses RPS

PENTING:
- Harap ganti password Anda setelah login pertama kali
- Jangan bagikan informasi akun Anda kepada orang lain

Jika ada pertanyaan, silakan hubungi administrator sistem.

Terima kasih.

---
SMART RPS System
Universitas Muhammadiyah Makassar
`, namaKaprodi, username, password, toEmail)

	message := []byte(fmt.Sprintf("Subject: %s\r\n\r\n%s", subject, body))

	auth := smtp.PlainAuth("", es.senderEmail, es.senderPasswd, es.smtpHost)

	err := smtp.SendMail(
		es.smtpHost+":"+es.smtpPort,
		auth,
		es.senderEmail,
		[]string{toEmail},
		message,
	)

	if err != nil {
		return fmt.Errorf("gagal mengirim email: %v", err)
	}

	return nil
}

func (es *EmailService) SendCourseAssignmentEmail(toEmail, namaLengkap string, courses []string) error {
	subject := "Penugasan Mata Kuliah - SMART RPS"

	courseList := strings.Join(courses, "\n- ")

	body := fmt.Sprintf(`
Yth. %s

Anda telah ditugaskan untuk mengampu mata kuliah berikut:

- %s

Silakan login ke sistem SMART RPS untuk membuat atau mengelola RPS mata kuliah tersebut.

Terima kasih.

---
SMART RPS System
Universitas Muhammadiyah Makassar
`, namaLengkap, courseList)

	message := []byte(fmt.Sprintf("Subject: %s\r\n\r\n%s", subject, body))

	auth := smtp.PlainAuth("", es.senderEmail, es.senderPasswd, es.smtpHost)

	err := smtp.SendMail(
		es.smtpHost+":"+es.smtpPort,
		auth,
		es.senderEmail,
		[]string{toEmail},
		message,
	)

	if err != nil {
		return fmt.Errorf("gagal mengirim email: %v", err)
	}

	return nil
}
