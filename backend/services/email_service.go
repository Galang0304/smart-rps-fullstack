package services

import (
	"fmt"
	"net/smtp"

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
	subject := "📚 Akun Dosen SMART RPS - Unismuh Makassar"

	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #43cea2 0%%, #185a9d 100%%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">📚 SMART RPS</h1>
            <p style="color: #d1f4e0; margin: 10px 0 0 0; font-size: 14px;">Universitas Muhammadiyah Makassar</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Selamat Datang, %s! 👋</h2>
            <p style="color: #555555; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
                Akun <strong>Dosen</strong> Anda telah berhasil dibuat. Anda sekarang dapat mengelola Rencana Pembelajaran Semester (RPS) untuk mata kuliah yang diampu.
            </p>

            <!-- Credential Box -->
            <div style="background: #f8f9fa; border-left: 4px solid #43cea2; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #43cea2; margin: 0 0 15px 0; font-size: 18px;">📋 Detail Akun Anda</h3>
                
                <div style="margin: 12px 0;">
                    <span style="color: #666666; font-size: 14px; display: block; margin-bottom: 5px;">Username</span>
                    <span style="background: #ffffff; padding: 10px 15px; border-radius: 6px; display: inline-block; color: #333333; font-weight: 600; font-size: 16px; border: 1px solid #e0e0e0;">%s</span>
                </div>
                
                <div style="margin: 12px 0;">
                    <span style="color: #666666; font-size: 14px; display: block; margin-bottom: 5px;">Password</span>
                    <span style="background: #ffffff; padding: 10px 15px; border-radius: 6px; display: inline-block; color: #333333; font-weight: 600; font-size: 16px; border: 1px solid #e0e0e0;">%s</span>
                </div>
                
                <div style="margin: 12px 0;">
                    <span style="color: #666666; font-size: 14px; display: block; margin-bottom: 5px;">Email</span>
                    <span style="background: #ffffff; padding: 10px 15px; border-radius: 6px; display: inline-block; color: #333333; font-size: 16px; border: 1px solid #e0e0e0;">%s</span>
                </div>
            </div>

            <!-- Features -->
            <div style="margin: 30px 0;">
                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">✨ Fitur yang Dapat Anda Gunakan:</h3>
                <ul style="color: #555555; line-height: 1.8; padding-left: 20px; margin: 0;">
                    <li>Mengelola RPS Mata Kuliah</li>
                    <li>Membuat dan Mengedit Dokumen RPS</li>
                    <li>Mengakses Mata Kuliah yang Diampu</li>
                    <li>Kolaborasi dengan Program Studi</li>
                </ul>
            </div>

            <!-- Warning Box -->
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 25px 0;">
                <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.6;">
                    <strong>⚠️ PENTING:</strong><br>
                    • Harap ganti password Anda setelah login pertama kali<br>
                    • Jangan bagikan informasi akun Anda kepada orang lain<br>
                    • Simpan username dan password dengan aman
                </p>
            </div>

            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://103.151.145.182" style="background: linear-gradient(135deg, #43cea2 0%%, #185a9d 100%%); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(67, 206, 162, 0.4);">
                    🚀 Login Sekarang
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #999999; margin: 0; font-size: 13px; line-height: 1.6;">
                Jika Anda memiliki pertanyaan, silakan hubungi administrator sistem.<br>
                Email: unismuhrps@gmail.com
            </p>
            <p style="color: #cccccc; margin: 15px 0 0 0; font-size: 12px;">
                © 2025 SMART RPS - Universitas Muhammadiyah Makassar
            </p>
        </div>
    </div>
</body>
</html>
`, namaLengkap, username, password, toEmail)

	message := []byte(fmt.Sprintf("Subject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n%s", subject, htmlBody))

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
	subject := "🎓 Akun Kaprodi SMART RPS - Unismuh Makassar"

	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🎓 SMART RPS</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">Universitas Muhammadiyah Makassar</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Selamat Datang, %s! 👋</h2>
            <p style="color: #555555; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
                Akun <strong>Kepala Program Studi</strong> Anda telah berhasil dibuat. Anda sekarang dapat mengelola program studi dan memberikan akses RPS kepada dosen.
            </p>

            <!-- Credential Box -->
            <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #667eea; margin: 0 0 15px 0; font-size: 18px;">📋 Detail Akun Anda</h3>
                
                <div style="margin: 12px 0;">
                    <span style="color: #666666; font-size: 14px; display: block; margin-bottom: 5px;">Username</span>
                    <span style="background: #ffffff; padding: 10px 15px; border-radius: 6px; display: inline-block; color: #333333; font-weight: 600; font-size: 16px; border: 1px solid #e0e0e0;">%s</span>
                </div>
                
                <div style="margin: 12px 0;">
                    <span style="color: #666666; font-size: 14px; display: block; margin-bottom: 5px;">Password</span>
                    <span style="background: #ffffff; padding: 10px 15px; border-radius: 6px; display: inline-block; color: #333333; font-weight: 600; font-size: 16px; border: 1px solid #e0e0e0;">%s</span>
                </div>
                
                <div style="margin: 12px 0;">
                    <span style="color: #666666; font-size: 14px; display: block; margin-bottom: 5px;">Email</span>
                    <span style="background: #ffffff; padding: 10px 15px; border-radius: 6px; display: inline-block; color: #333333; font-size: 16px; border: 1px solid #e0e0e0;">%s</span>
                </div>
            </div>

            <!-- Features -->
            <div style="margin: 30px 0;">
                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">✨ Fitur yang Dapat Anda Gunakan:</h3>
                <ul style="color: #555555; line-height: 1.8; padding-left: 20px; margin: 0;">
                    <li>Mengelola Program Studi dan Mata Kuliah</li>
                    <li>Menugaskan Dosen pada Mata Kuliah</li>
                    <li>Memberikan Akses RPS kepada Dosen</li>
                    <li>Monitoring Aktivitas Akademik</li>
                </ul>
            </div>

            <!-- Warning Box -->
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 25px 0;">
                <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.6;">
                    <strong>⚠️ PENTING:</strong><br>
                    • Harap ganti password Anda setelah login pertama kali<br>
                    • Jangan bagikan informasi akun Anda kepada orang lain<br>
                    • Simpan username dan password dengan aman
                </p>
            </div>

            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://103.151.145.182" style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                    🚀 Login Sekarang
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #999999; margin: 0; font-size: 13px; line-height: 1.6;">
                Jika Anda memiliki pertanyaan, silakan hubungi administrator sistem.<br>
                Email: unismuhrps@gmail.com
            </p>
            <p style="color: #cccccc; margin: 15px 0 0 0; font-size: 12px;">
                © 2025 SMART RPS - Universitas Muhammadiyah Makassar
            </p>
        </div>
    </div>
</body>
</html>
`, namaKaprodi, username, password, toEmail)

	message := []byte(fmt.Sprintf("Subject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n%s", subject, htmlBody))

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
	subject := "📖 Penugasan Mata Kuliah - SMART RPS"

	courseListHTML := ""
	for _, course := range courses {
		courseListHTML += fmt.Sprintf(`
                    <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                        <span style="color: #333333; font-weight: 500;">%s</span>
                    </li>`, course)
	}

	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f093fb 0%%, #f5576c 100%%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">📖 SMART RPS</h1>
            <p style="color: #ffe0eb; margin: 10px 0 0 0; font-size: 14px;">Universitas Muhammadiyah Makassar</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Penugasan Mata Kuliah 📚</h2>
            <p style="color: #555555; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
                Yth. <strong>%s</strong>,<br><br>
                Anda telah ditugaskan untuk mengampu mata kuliah berikut. Silakan login ke sistem SMART RPS untuk membuat atau mengelola RPS mata kuliah tersebut.
            </p>

            <!-- Course List -->
            <div style="background: #f8f9fa; border-left: 4px solid #f093fb; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #f5576c; margin: 0 0 15px 0; font-size: 18px;">📋 Mata Kuliah yang Diampu:</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    %s
                </ul>
            </div>

            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://103.151.145.182" style="background: linear-gradient(135deg, #f093fb 0%%, #f5576c 100%%); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(245, 87, 108, 0.4);">
                    🚀 Buka SMART RPS
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #999999; margin: 0; font-size: 13px; line-height: 1.6;">
                Jika Anda memiliki pertanyaan, silakan hubungi administrator sistem.<br>
                Email: unismuhrps@gmail.com
            </p>
            <p style="color: #cccccc; margin: 15px 0 0 0; font-size: 12px;">
                © 2025 SMART RPS - Universitas Muhammadiyah Makassar
            </p>
        </div>
    </div>
</body>
</html>
`, namaLengkap, courseListHTML)

	message := []byte(fmt.Sprintf("Subject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n%s", subject, htmlBody))

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
