--
-- PostgreSQL database dump
--

\restrict t3dwXrEnBTlbU6GNaMiVn03icqY1WZYhIdRwyewVZqdkTvB0giVxbkBorRAdICf

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.sub_cpmk DROP CONSTRAINT IF EXISTS sub_cpmk_cpmk_id_fkey;
ALTER TABLE IF EXISTS ONLY public.generated_rps DROP CONSTRAINT IF EXISTS generated_rps_course_id_fkey;
ALTER TABLE IF EXISTS ONLY public.templates DROP CONSTRAINT IF EXISTS fk_templates_program;
ALTER TABLE IF EXISTS ONLY public.templates DROP CONSTRAINT IF EXISTS fk_templates_creator;
ALTER TABLE IF EXISTS ONLY public.template_versions DROP CONSTRAINT IF EXISTS fk_template_versions_template;
ALTER TABLE IF EXISTS ONLY public.template_versions DROP CONSTRAINT IF EXISTS fk_template_versions_creator;
ALTER TABLE IF EXISTS ONLY public.programs DROP CONSTRAINT IF EXISTS fk_programs_prodi;
ALTER TABLE IF EXISTS ONLY public.prodis DROP CONSTRAINT IF EXISTS fk_prodis_user;
ALTER TABLE IF EXISTS ONLY public.prodis DROP CONSTRAINT IF EXISTS fk_prodis_programs;
ALTER TABLE IF EXISTS ONLY public.prodis DROP CONSTRAINT IF EXISTS fk_prodis_program;
ALTER TABLE IF EXISTS ONLY public.generated_rps DROP CONSTRAINT IF EXISTS fk_generated_rps_template_version;
ALTER TABLE IF EXISTS ONLY public.generated_rps DROP CONSTRAINT IF EXISTS fk_generated_rps_generator;
ALTER TABLE IF EXISTS ONLY public.generated_rps DROP CONSTRAINT IF EXISTS fk_generated_rps_course;
ALTER TABLE IF EXISTS ONLY public.dosens DROP CONSTRAINT IF EXISTS fk_dosens_user;
ALTER TABLE IF EXISTS ONLY public.dosens DROP CONSTRAINT IF EXISTS fk_dosens_prodi;
ALTER TABLE IF EXISTS ONLY public.dosen_rps_accesses DROP CONSTRAINT IF EXISTS fk_dosen_rps_accesses_granter;
ALTER TABLE IF EXISTS ONLY public.dosen_rps_accesses DROP CONSTRAINT IF EXISTS fk_dosen_rps_accesses_generated_rps;
ALTER TABLE IF EXISTS ONLY public.dosen_rps_accesses DROP CONSTRAINT IF EXISTS fk_dosen_rps_accesses_dosen;
ALTER TABLE IF EXISTS ONLY public.dosen_courses DROP CONSTRAINT IF EXISTS fk_dosen_courses_dosen;
ALTER TABLE IF EXISTS ONLY public.dosen_courses DROP CONSTRAINT IF EXISTS fk_dosen_courses_course;
ALTER TABLE IF EXISTS ONLY public.courses DROP CONSTRAINT IF EXISTS fk_courses_program;
ALTER TABLE IF EXISTS ONLY public.courses DROP CONSTRAINT IF EXISTS fk_courses_prodi;
ALTER TABLE IF EXISTS ONLY public.dosen_rps_access DROP CONSTRAINT IF EXISTS dosen_rps_access_granted_by_fkey;
ALTER TABLE IF EXISTS ONLY public.dosen_rps_access DROP CONSTRAINT IF EXISTS dosen_rps_access_generated_rps_id_fkey;
ALTER TABLE IF EXISTS ONLY public.dosen_rps_access DROP CONSTRAINT IF EXISTS dosen_rps_access_dosen_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cpmk DROP CONSTRAINT IF EXISTS cpmk_course_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cpl DROP CONSTRAINT IF EXISTS cpl_prodi_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cpl_indikator DROP CONSTRAINT IF EXISTS cpl_indikator_cpl_id_fkey;
DROP INDEX IF EXISTS public.idx_users_username;
DROP INDEX IF EXISTS public.idx_users_deleted_at;
DROP INDEX IF EXISTS public.idx_templates_program_id;
DROP INDEX IF EXISTS public.idx_templates_deleted_at;
DROP INDEX IF EXISTS public.idx_template_versions_deleted_at;
DROP INDEX IF EXISTS public.idx_sub_cpmk_cpmk_id;
DROP INDEX IF EXISTS public.idx_programs_deleted_at;
DROP INDEX IF EXISTS public.idx_programs_code;
DROP INDEX IF EXISTS public.idx_prodis_kode_prodi;
DROP INDEX IF EXISTS public.idx_prodis_deleted_at;
DROP INDEX IF EXISTS public.idx_generated_rps_deleted_at;
DROP INDEX IF EXISTS public.idx_generated_rps_course_id;
DROP INDEX IF EXISTS public.idx_dosens_deleted_at;
DROP INDEX IF EXISTS public.idx_dosen_rps_accesses_deleted_at;
DROP INDEX IF EXISTS public.idx_dosen_rps_access_dosen_id;
DROP INDEX IF EXISTS public.idx_cpmk_course_id;
DROP INDEX IF EXISTS public.idx_cpl_prodi_id;
DROP INDEX IF EXISTS public.idx_cpl_kode_cpl;
DROP INDEX IF EXISTS public.idx_cpl_indikator_cpl_id;
DROP INDEX IF EXISTS public.idx_courses_program_id;
DROP INDEX IF EXISTS public.idx_courses_deleted_at;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.templates DROP CONSTRAINT IF EXISTS templates_pkey;
ALTER TABLE IF EXISTS ONLY public.template_versions DROP CONSTRAINT IF EXISTS template_versions_pkey;
ALTER TABLE IF EXISTS ONLY public.sub_cpmk DROP CONSTRAINT IF EXISTS sub_cpmk_pkey;
ALTER TABLE IF EXISTS ONLY public.programs DROP CONSTRAINT IF EXISTS programs_pkey;
ALTER TABLE IF EXISTS ONLY public.programs DROP CONSTRAINT IF EXISTS programs_code_key;
ALTER TABLE IF EXISTS ONLY public.prodis DROP CONSTRAINT IF EXISTS prodis_pkey;
ALTER TABLE IF EXISTS ONLY public.prodis DROP CONSTRAINT IF EXISTS prodis_kode_prodi_key;
ALTER TABLE IF EXISTS ONLY public.generated_rps DROP CONSTRAINT IF EXISTS generated_rps_pkey;
ALTER TABLE IF EXISTS ONLY public.dosens DROP CONSTRAINT IF EXISTS dosens_pkey;
ALTER TABLE IF EXISTS ONLY public.dosens DROP CONSTRAINT IF EXISTS dosens_n_id_n_key;
ALTER TABLE IF EXISTS ONLY public.dosens DROP CONSTRAINT IF EXISTS dosens_email_key;
ALTER TABLE IF EXISTS ONLY public.dosen_rps_accesses DROP CONSTRAINT IF EXISTS dosen_rps_accesses_pkey;
ALTER TABLE IF EXISTS ONLY public.dosen_rps_access DROP CONSTRAINT IF EXISTS dosen_rps_access_pkey;
ALTER TABLE IF EXISTS ONLY public.dosen_courses DROP CONSTRAINT IF EXISTS dosen_courses_pkey;
ALTER TABLE IF EXISTS ONLY public.cpmk DROP CONSTRAINT IF EXISTS cpmk_pkey;
ALTER TABLE IF EXISTS ONLY public.cpl DROP CONSTRAINT IF EXISTS cpl_pkey;
ALTER TABLE IF EXISTS ONLY public.cpl_indikator DROP CONSTRAINT IF EXISTS cpl_indikator_pkey;
ALTER TABLE IF EXISTS ONLY public.courses DROP CONSTRAINT IF EXISTS courses_pkey;
ALTER TABLE IF EXISTS ONLY public.courses DROP CONSTRAINT IF EXISTS courses_code_key;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.templates;
DROP TABLE IF EXISTS public.template_versions;
DROP TABLE IF EXISTS public.sub_cpmk;
DROP TABLE IF EXISTS public.programs;
DROP TABLE IF EXISTS public.prodis;
DROP TABLE IF EXISTS public.generated_rps;
DROP TABLE IF EXISTS public.dosens;
DROP TABLE IF EXISTS public.dosen_rps_accesses;
DROP TABLE IF EXISTS public.dosen_rps_access;
DROP TABLE IF EXISTS public.dosen_courses;
DROP TABLE IF EXISTS public.cpmk;
DROP TABLE IF EXISTS public.cpl_indikator;
DROP TABLE IF EXISTS public.cpl;
DROP TABLE IF EXISTS public.courses;
DROP EXTENSION IF EXISTS "uuid-ossp";
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: smart_rps_user
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    program_id uuid,
    code text NOT NULL,
    title text NOT NULL,
    credits bigint,
    semester bigint,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    prodi_id uuid,
    tahun text DEFAULT '2025'::text NOT NULL
);


ALTER TABLE public.courses OWNER TO smart_rps_user;

--
-- Name: cpl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cpl (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    prodi_id uuid NOT NULL,
    kode_cpl text NOT NULL,
    komponen text NOT NULL,
    cpl text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone
);


ALTER TABLE public.cpl OWNER TO postgres;

--
-- Name: cpl_indikator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cpl_indikator (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cpl_id uuid NOT NULL,
    indikator_kerja text NOT NULL,
    urutan integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone
);


ALTER TABLE public.cpl_indikator OWNER TO postgres;

--
-- Name: cpmk; Type: TABLE; Schema: public; Owner: smart_rps_user
--

CREATE TABLE public.cpmk (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    cpmk_number integer NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone
);


ALTER TABLE public.cpmk OWNER TO smart_rps_user;

--
-- Name: dosen_courses; Type: TABLE; Schema: public; Owner: smart_rps_user
--

CREATE TABLE public.dosen_courses (
    dosen_id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE public.dosen_courses OWNER TO smart_rps_user;

--
-- Name: dosen_rps_access; Type: TABLE; Schema: public; Owner: smart_rps_user
--

CREATE TABLE public.dosen_rps_access (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    dosen_id uuid NOT NULL,
    generated_rps_id uuid NOT NULL,
    access_level text DEFAULT 'read'::text NOT NULL,
    granted_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone
);


ALTER TABLE public.dosen_rps_access OWNER TO smart_rps_user;

--
-- Name: dosen_rps_accesses; Type: TABLE; Schema: public; Owner: smart_rps_user
--

CREATE TABLE public.dosen_rps_accesses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    dosen_id uuid NOT NULL,
    generated_rps_id uuid NOT NULL,
    access_level text DEFAULT 'read'::text NOT NULL,
    granted_by uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.dosen_rps_accesses OWNER TO smart_rps_user;

--
-- Name: dosens; Type: TABLE; Schema: public; Owner: smart_rps_user
--

CREATE TABLE public.dosens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    prodi_id uuid,
    n_id_n text NOT NULL,
    nama_lengkap text NOT NULL,
    email text NOT NULL,
    no_telepon text,
    jabatan_fungsional text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.dosens OWNER TO smart_rps_user;

--
-- Name: generated_rps; Type: TABLE; Schema: public; Owner: smart_rps_user
--

CREATE TABLE public.generated_rps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    template_version_id uuid,
    course_id uuid,
    generated_by uuid,
    status text DEFAULT 'draft'::text,
    result jsonb,
    exported_file_url text,
    ai_metadata jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.generated_rps OWNER TO smart_rps_user;

--
-- Name: prodis; Type: TABLE; Schema: public; Owner: smart_rps_user
--

CREATE TABLE public.prodis (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    kode_prodi text NOT NULL,
    nama_prodi text NOT NULL,
    fakultas text NOT NULL,
    jenjang text NOT NULL,
    email_kaprodi text NOT NULL,
    nama_kaprodi text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    program_id uuid
);


ALTER TABLE public.prodis OWNER TO smart_rps_user;

--
-- Name: programs; Type: TABLE; Schema: public; Owner: smart_rps_user
--

CREATE TABLE public.programs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    prodi_id uuid,
    code text NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.programs OWNER TO smart_rps_user;

--
-- Name: sub_cpmk; Type: TABLE; Schema: public; Owner: smart_rps_user
--

CREATE TABLE public.sub_cpmk (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cpmk_id uuid NOT NULL,
    sub_cpmk_number integer NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone
);


ALTER TABLE public.sub_cpmk OWNER TO smart_rps_user;

--
-- Name: template_versions; Type: TABLE; Schema: public; Owner: smart_rps_user
--

CREATE TABLE public.template_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    template_id uuid,
    version bigint NOT NULL,
    definition jsonb,
    created_by uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.template_versions OWNER TO smart_rps_user;

--
-- Name: templates; Type: TABLE; Schema: public; Owner: smart_rps_user
--

CREATE TABLE public.templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    program_id uuid,
    name text NOT NULL,
    description text,
    created_by uuid,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.templates OWNER TO smart_rps_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: smart_rps_user
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    email text,
    display_name text,
    role text DEFAULT 'viewer'::text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO smart_rps_user;

--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: smart_rps_user
--

COPY public.courses (id, program_id, code, title, credits, semester, created_at, updated_at, deleted_at, prodi_id, tahun) FROM stdin;
ef59bbe0-fbb1-4b7e-8af6-edc29da9d512	78fb8b78-111f-4ffa-8396-fe68a3caaff7	AW60910042105	Pendidikan Agama Islam	2	1	2025-12-17 22:50:38.142815+08	2025-12-17 22:50:38.142815+08	\N	\N	20251
a282cd65-55b7-46c5-9f6c-90cc3a10286f	78fb8b78-111f-4ffa-8396-fe68a3caaff7	AW60910042101	Pendidikan Pancasila	2	1	2025-12-17 22:50:38.146105+08	2025-12-17 22:50:38.146105+08	\N	\N	20251
8c7b796e-6bf7-4f51-b8fd-f5831900298b	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202301	Matematika I	3	1	2025-12-17 22:50:38.147617+08	2025-12-17 22:50:38.147617+08	\N	\N	20251
036843d8-177a-4b11-8928-1d560a7b4d1d	78fb8b78-111f-4ffa-8396-fe68a3caaff7	AW60910042103	Bahasa Indonesia	2	1	2025-12-17 22:50:38.148813+08	2025-12-17 22:50:38.148813+08	\N	\N	20251
20ee1278-a3ba-4e5a-8cdd-243629c31a56	78fb8b78-111f-4ffa-8396-fe68a3caaff7	AW60910042106	Bahasa Inggris	2	1	2025-12-17 22:50:38.150681+08	2025-12-17 22:50:38.150681+08	\N	\N	20251
39ff239d-95de-4729-a5ff-ff416e88808a	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202102	Komputer 1	2	1	2025-12-17 22:50:38.152519+08	2025-12-17 22:50:38.152519+08	\N	\N	20251
1758d5ea-1a7a-48ee-8f4e-826e4b9c0775	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220203103	Fisika I	3	1	2025-12-17 22:50:38.154256+08	2025-12-17 22:50:38.154256+08	\N	\N	20251
3b97e512-deac-437f-a7af-0a5adb890730	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202104	Menggambar Teknik	2	1	2025-12-17 22:50:38.155305+08	2025-12-17 22:50:38.155305+08	\N	\N	20251
186aa49d-2f32-4047-a3ed-9c9f7eead726	78fb8b78-111f-4ffa-8396-fe68a3caaff7	AW60910042206	AIK II (Peng. Studi Islam & Kemuh. 2)	2	2	2025-12-17 22:50:38.156856+08	2025-12-17 22:50:38.156856+08	\N	\N	20252
15cc2515-dd94-4c3e-a7fe-66066a7c18ea	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202201	Mekanika Teknik I	2	2	2025-12-17 22:50:38.1579+08	2025-12-17 22:50:38.1579+08	\N	\N	20252
e327f079-606a-453e-98f9-47b549931547	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202302	Matematika II	3	2	2025-12-17 22:50:38.158424+08	2025-12-17 22:50:38.158424+08	\N	\N	20252
c31df656-5b43-49b8-adb7-d18b652a013d	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202303	Fisika II	3	2	2025-12-17 22:50:38.159458+08	2025-12-17 22:50:38.159458+08	\N	\N	20252
a128a351-b08f-4d99-9a34-5bf9133b4e8f	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202204	Hidrolika Dasar	2	2	2025-12-17 22:50:38.160067+08	2025-12-17 22:50:38.160067+08	\N	\N	20252
a19f7c46-6f8f-44b2-82d6-374ce3af07b5	78fb8b78-111f-4ffa-8396-fe68a3caaff7	AW60910042202	Pendidikan Kewarganegaraan	2	2	2025-12-17 22:50:38.161266+08	2025-12-17 22:50:38.161266+08	\N	\N	20252
d45f6a86-d4c3-41f0-9046-a6dc973001eb	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202205	Bahasa Inggris Teknik	2	2	2025-12-17 22:50:38.162309+08	2025-12-17 22:50:38.162309+08	\N	\N	20252
9cf0092c-4eee-4432-89a6-09da9fff56d3	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202206	Ilmu Ukur Tanah & Pemetaan	2	2	2025-12-17 22:50:38.16392+08	2025-12-17 22:50:38.16392+08	\N	\N	20252
8fe6d386-61fa-4b94-a75b-889cc559f711	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202207	Sains Kebumian (Hidrologi I)	2	2	2025-12-17 22:50:38.165051+08	2025-12-17 22:50:38.165051+08	\N	\N	20252
0343526c-69a1-4dcb-8006-4d2be1763604	78fb8b78-111f-4ffa-8396-fe68a3caaff7	AW60910042307	AIK III (Aqidah Islam & Kemuh. 3)	2	3	2025-12-17 22:50:38.166298+08	2025-12-17 22:50:38.166298+08	\N	\N	20251
655d2811-67ab-422c-a8ba-ea3ac5c932e8	78fb8b78-111f-4ffa-8396-fe68a3caaff7	BW6042303	Kepemimpinan & Kewirausahaan	2	3	2025-12-17 22:50:38.168917+08	2025-12-17 22:50:38.168917+08	\N	\N	20251
a51d25c6-1313-4fda-adf7-85ac15e80cd1	78fb8b78-111f-4ffa-8396-fe68a3caaff7	BW6042302	Etika Profesi	2	3	2025-12-17 22:50:38.171132+08	2025-12-17 22:50:38.171132+08	\N	\N	20251
9aaf78bf-bdb2-4def-b106-01b309c22f39	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202304	Geologi	2	3	2025-12-17 22:50:38.172167+08	2025-12-17 22:50:38.172167+08	\N	\N	20251
745858f1-604b-4421-bd20-56ab8d02ced7	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202305	Statistika & Probabilitas	2	3	2025-12-17 22:50:38.173237+08	2025-12-17 22:50:38.173237+08	\N	\N	20251
83845056-e7ce-4495-b867-f8bd24a0b7fb	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202306	Hidrologi II	3	3	2025-12-17 22:50:38.174262+08	2025-12-17 22:50:38.174262+08	\N	\N	20251
58da71e5-9528-4f85-9649-976d128ba564	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202307	Pengelolaan Kualitas Jaringan Perpipaan	2	3	2025-12-17 22:50:38.174789+08	2025-12-17 22:50:38.174789+08	\N	\N	20251
25b38d7a-5a8a-49a8-bc18-86328b038259	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220202308	Standarisasi Keselamatan Kerja	2	3	2025-12-17 22:50:38.175915+08	2025-12-17 22:50:38.175915+08	\N	\N	20251
4b04323e-5a49-431f-8f5d-889b416fea4c	78fb8b78-111f-4ffa-8396-fe68a3caaff7	AW60910042408	AIK IV (Ibadah Khassah & Kemuh. 4)	2	4	2025-12-17 22:50:38.176972+08	2025-12-17 22:50:38.176972+08	\N	\N	20252
d8d56fdd-d996-40e4-bec0-f1de0e98f7f1	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CP6220223401	Matematika IV	3	4	2025-12-17 22:50:38.178009+08	2025-12-17 22:50:38.178009+08	\N	\N	20252
4183f953-eef6-4b87-aee6-45e11688bf5b	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222401	Mekanika Tanah I	2	4	2025-12-17 22:50:38.179158+08	2025-12-17 22:50:38.179158+08	\N	\N	20252
ff24d36e-f875-4e17-8c7d-6cbc98e2e1b6	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222402	Ekonomi Teknik	2	4	2025-12-17 22:50:38.1797+08	2025-12-17 22:50:38.1797+08	\N	\N	20252
09b7406a-1a3f-4a71-a494-084a08f7e657	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222403	Teknik Lingkungan & AMDAL	2	4	2025-12-17 22:50:38.180823+08	2025-12-17 22:50:38.180823+08	\N	\N	20252
129e4398-9121-40a5-bd3c-8781a8da8cb9	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222404	Kimia	2	4	2025-12-17 22:50:38.182052+08	2025-12-17 22:50:38.182052+08	\N	\N	20252
42d307cb-2d3e-49ca-a8a3-de20dd7db04a	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222405	Aplikasi Komputer 2	3	4	2025-12-17 22:50:38.183275+08	2025-12-17 22:50:38.183275+08	\N	\N	20252
4a7b4832-3288-4de6-81b4-059c176a97b4	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222406	Ilmu Tanah & Tanaman	2	4	2025-12-17 22:50:38.184323+08	2025-12-17 22:50:38.184323+08	\N	\N	20252
a8bac38d-1b0b-4c86-afc0-efaf64845e3e	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222407	Konstruksi Beton I	2	4	2025-12-17 22:50:38.185362+08	2025-12-17 22:50:38.185362+08	\N	\N	20252
6d8fec6f-3844-452a-b2ce-113879e4ab18	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222408	Konstruksi Baja	2	4	2025-12-17 22:50:38.186432+08	2025-12-17 22:50:38.186432+08	\N	\N	20252
7d9fd057-47d3-4ced-a74e-78ba889e6092	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222501	Konstruksi Bendungan I	2	5	2025-12-17 22:50:38.187489+08	2025-12-17 22:50:38.187489+08	\N	\N	20251
70fa1753-6c94-433b-8199-187402d9fecb	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CP62202220501	Pemindahan Tanah Mekanis	2	5	2025-12-17 22:50:38.188013+08	2025-12-17 22:50:38.188013+08	\N	\N	20251
bee8f2a5-1a84-4395-8ccc-ba6d71a0db92	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222502	Manajemen Air	2	5	2025-12-17 22:50:38.189037+08	2025-12-17 22:50:38.189037+08	\N	\N	20251
70f548a5-90e4-4563-b409-9a7ec2440e54	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222503	Pengembangan Sumber Daya Air	2	5	2025-12-17 22:50:38.190339+08	2025-12-17 22:50:38.190339+08	\N	\N	20251
163ed239-5d48-46d7-8113-040dfc65cfdb	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222504	Perencanaan Drainase Kota	2	5	2025-12-17 22:50:38.190866+08	2025-12-17 22:50:38.190866+08	\N	\N	20251
a6a068f7-84af-406c-936e-35e01daba2fa	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222505	Teknik Pantai	2	5	2025-12-17 22:50:38.191914+08	2025-12-17 22:50:38.191914+08	\N	\N	20251
602674dd-a9fb-4c20-815d-567bfd023871	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222506	Konstruksi Beton II	2	5	2025-12-17 22:50:38.192996+08	2025-12-17 22:50:38.192996+08	\N	\N	20251
2b2f7f62-3ce5-4a71-8dbd-504630479cdd	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222507	Teknik Sungai I	2	5	2025-12-17 22:50:38.194309+08	2025-12-17 22:50:38.194309+08	\N	\N	20251
c92279ab-a524-4d4b-80fc-307220441dd8	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222508	Teknik Pondasi	2	5	2025-12-17 22:50:38.196679+08	2025-12-17 22:50:38.196679+08	\N	\N	20251
76024a5f-2cb1-4b07-b7c5-7a2062915ca9	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222509	Manajemen Konstruksi	2	5	2025-12-17 22:50:38.197732+08	2025-12-17 22:50:38.197732+08	\N	\N	20251
17d5cde3-c3b3-4198-b57e-cb1a691add7b	78fb8b78-111f-4ffa-8396-fe68a3caaff7	BW6042504	Metode Penelitian	2	5	2025-12-17 22:50:38.198788+08	2025-12-17 22:50:38.198788+08	\N	\N	20251
2427f215-ba4c-404b-8dca-09c45f61eb06	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6222022509	Mekanika Tanah II	2	5	2025-12-17 22:50:38.199986+08	2025-12-17 22:50:38.199986+08	\N	\N	20251
b6007f8f-a863-407d-94f2-76e1c0a2581f	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222601	Konstruksi Bendungan II	3	6	2025-12-17 22:50:38.200624+08	2025-12-17 22:50:38.200624+08	\N	\N	20252
d2247222-4d70-4793-8616-a87565de123c	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222602	Transpor Sedimen	2	6	2025-12-17 22:50:38.201661+08	2025-12-17 22:50:38.201661+08	\N	\N	20252
913429ba-2d7b-427a-a910-a6613d4eea01	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222603	Bangunan Irigasi	2	6	2025-12-17 22:50:38.20269+08	2025-12-17 22:50:38.20269+08	\N	\N	20252
c50c57e9-cc1c-496a-adba-ed79d52e9020	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222604	Jaringan Irigasi	2	6	2025-12-17 22:50:38.203737+08	2025-12-17 22:50:38.203737+08	\N	\N	20252
d9506bc8-a306-4480-be16-e0b8a06fff61	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222605	Reklamasi & Bangunan Pantai	2	6	2025-12-17 22:50:38.204277+08	2025-12-17 22:50:38.204277+08	\N	\N	20252
bc629e61-ef3f-41a1-9958-73d5a2094ada	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222606	Pengelolaan Air Tanah	2	6	2025-12-17 22:50:38.205802+08	2025-12-17 22:50:38.205802+08	\N	\N	20252
7e8c1886-5348-4f66-987c-0b736b5fceab	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222607	Perencanaan & Pengelolaan Waduk	2	6	2025-12-17 22:50:38.206919+08	2025-12-17 22:50:38.206919+08	\N	\N	20252
ebec4e67-a478-41c6-9605-fb24fb33d208	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222608	Perencanaan PLTA	2	6	2025-12-17 22:50:38.207447+08	2025-12-17 22:50:38.207447+08	\N	\N	20252
e4a4726b-acfe-414c-ad31-c9b5ca15d180	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6220222609	Teknik Jalan Raya	2	6	2025-12-17 22:50:38.208501+08	2025-12-17 22:50:38.208501+08	\N	\N	20252
1dfc722a-274f-426d-b4a5-f8bef0eb62b9	78fb8b78-111f-4ffa-8396-fe68a3caaff7	BW6044705	KKP-Plus	4	7	2025-12-17 22:50:38.209573+08	2025-12-17 22:50:38.209573+08	\N	\N	20251
e3dd615e-480b-44e7-9f81-12d050728519	78fb8b78-111f-4ffa-8396-fe68a3caaff7	CW6222024701	Capstone Design	4	7	2025-12-17 22:50:38.210617+08	2025-12-17 22:50:38.210617+08	\N	\N	20251
957683e2-4f71-4e02-b7eb-245d625ba14b	78fb8b78-111f-4ffa-8396-fe68a3caaff7	BW6042706	Seminar Usul/Proposal	2	7	2025-12-17 22:50:38.211146+08	2025-12-17 22:50:38.211146+08	\N	\N	20251
1bd809f2-76d8-42d6-8e0d-3a9d920bc081	78fb8b78-111f-4ffa-8396-fe68a3caaff7	BW6046707	Skripsi	6	7	2025-12-17 22:50:38.212271+08	2025-12-17 22:50:38.212271+08	\N	\N	20251
\.


--
-- Data for Name: cpl; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cpl (id, prodi_id, kode_cpl, komponen, cpl, created_at, updated_at, deleted_at) FROM stdin;
44609009-6d62-445b-b5e6-eb22eea2e66a	cf1f1218-e4f2-4020-b320-70d70b62c8ab	CPL-01	Pengetahuan Umum	Mampu menerapkan pengetahuan matematika, ilmu alam, dan teknologi informasi untuk memahami prinsip-prinsip dasar teknik sumber daya air.	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
8f8b77a1-5e5f-463a-a1dc-5f3a25da2930	cf1f1218-e4f2-4020-b320-70d70b62c8ab	CPL-02	Keterampilan Khusus	Mampu merancang sistem jaringan bangunan air dengan mempertimbangkan aspek hukum, ekonomi, lingkungan, sosial, politik, kesehatan dan keselamatan, serta keberlanjutan, serta mengenali dan/atau memanfaatkan potensi sumber daya local dan nasional dengan perspektif global.	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
4a877687-0b38-4b7c-8a8e-0b48f328b995	cf1f1218-e4f2-4020-b320-70d70b62c8ab	CPL-03	Keterampilan Khusus	Mampu merancang dan melakukan eksperimen laboratorium maupun pengamatan lapangan serta mampu menganalisis dan menginterpretasikan data untuk mendukung penilaian teknik sumber daya air.	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
4e0c3607-89f5-4258-8fd1-25c811658997	cf1f1218-e4f2-4020-b320-70d70b62c8ab	CPL-04	Keterampilan Khusus	Mampu mengidentifikasi, merumuskan, menganalisis, dan memecahkan permasalahan kompleks di bidang teknik sumber daya air.	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
28c190e5-b777-42f8-a3d1-c4ff54d88eb3	cf1f1218-e4f2-4020-b320-70d70b62c8ab	CPL-05	Keterampilan Khusus	Mampu menerapkan metode, keterampilan, dan alat rekayasa modern dalam praktik teknik sumber daya air.	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
c745dd6d-53ef-4219-a9ea-f58409cab75c	cf1f1218-e4f2-4020-b320-70d70b62c8ab	CPL-06	Keterampilan Umum	Mampu berkomunikasi secara efektif baik secara lisan dan tertulis dalam menyampaikan ide maupun hasil analisis.	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
233b65f5-eb5c-4aca-8573-5ba224c45b0d	cf1f1218-e4f2-4020-b320-70d70b62c8ab	CPL-07	Keterampilan Umum	Mampu merencanakan, melaksanakan, dan mengevaluasi tugas Teknik sumber daya air sesuai dengan batasan yang tersedia.	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
2cd99a5b-c36b-4d6d-af83-772a01a5860e	cf1f1218-e4f2-4020-b320-70d70b62c8ab	CPL-08	Keterampilan Umum	Mampu bekerja dalam tim multidisiplin dan multicultural.	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
f348555d-8d02-4f52-b808-2958ad534032	cf1f1218-e4f2-4020-b320-70d70b62c8ab	CPL-09	Sikap	Mampu bertanggung jawab secara profesional dan mematuhi etika profesional terhadap masyarakat dalam merancang dan mengelola infrastruktur Teknik sumber daya air yang aman.	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
e99e818e-3517-46e6-9331-c19d0fefd036	cf1f1218-e4f2-4020-b320-70d70b62c8ab	CPL-10	Sikap	Mampu menyadari pentingnya pembelajaran sepanjang hayat dengan menerapkan Al Islam Kemuhammadiyahan dan terus mengakses pengetahuan terbaru dan isu yang sejalan dengan perkembangan zaman di bidang sumber daya air.	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
d834cc3f-141e-4eeb-955a-151756cb7ebe	004feea9-5fb3-408c-9d4b-89e84610902a	CPL-01	Pengetahuan Umum	Mampu menerapkan pengetahuan matematika, ilmu alam, dan teknologi informasi untuk memahami prinsip-prinsip dasar teknik sumber daya air.	2025-12-17 22:17:02.26961	2025-12-17 22:17:02.26961	\N
925ecece-172a-4ca2-a85d-43be3a6d02de	004feea9-5fb3-408c-9d4b-89e84610902a	CPL-02	Keterampilan Khusus	Mampu merancang sistem jaringan bangunan air dengan mempertimbangkan aspek hukum, ekonomi, lingkungan, sosial, politik, kesehatan dan keselamatan, serta keberlanjutan, serta mengenali dan/atau memanfaatkan potensi sumber daya local dan nasional dengan perspektif global.	2025-12-17 22:17:02.27875	2025-12-17 22:17:02.27875	\N
dcc77232-341e-4693-a297-7b002f2ae4f7	004feea9-5fb3-408c-9d4b-89e84610902a	CPL-03	Keterampilan Khusus	Mampu merancang dan melakukan eksperimen laboratorium maupun pengamatan lapangan serta mampu menganalisis dan menginterpretasikan data untuk mendukung penilaian teknik sumber daya air.	2025-12-17 22:17:02.282605	2025-12-17 22:17:02.282605	\N
55fa90d7-6154-4155-a1cc-426581ccab60	004feea9-5fb3-408c-9d4b-89e84610902a	CPL-04	Keterampilan Khusus	Mampu mengidentifikasi, merumuskan, menganalisis, dan memecahkan permasalahan kompleks di bidang teknik sumber daya air.	2025-12-17 22:17:02.287108	2025-12-17 22:17:02.287108	\N
2e19d414-c379-4e7e-87c9-4d7150430840	004feea9-5fb3-408c-9d4b-89e84610902a	CPL-05	Keterampilan Khusus	Mampu menerapkan metode, keterampilan, dan alat rekayasa modern dalam praktik teknik sumber daya air.	2025-12-17 22:17:02.290699	2025-12-17 22:17:02.290699	\N
b7a2c8c8-0359-4d1e-b693-64e5934d3521	004feea9-5fb3-408c-9d4b-89e84610902a	CPL-06	Keterampilan Umum	Mampu berkomunikasi secara efektif baik secara lisan dan tertulis dalam menyampaikan ide maupun hasil analisis.	2025-12-17 22:17:02.295005	2025-12-17 22:17:02.295005	\N
22f2ab09-6ffe-4150-b39e-49bed078f0e5	004feea9-5fb3-408c-9d4b-89e84610902a	CPL-07	Keterampilan Umum	Mampu merencanakan, melaksanakan, dan mengevaluasi tugas Teknik sumber daya air sesuai dengan batasan yang tersedia.	2025-12-17 22:17:02.298007	2025-12-17 22:17:02.298007	\N
c13ba416-aace-4587-8cd3-fcd9db568177	004feea9-5fb3-408c-9d4b-89e84610902a	CPL-08	Keterampilan Umum	Mampu bekerja dalam tim multidisiplin dan multicultural.	2025-12-17 22:17:02.301645	2025-12-17 22:17:02.301645	\N
8e1473c1-3caa-4a1f-aefb-3138033a2642	004feea9-5fb3-408c-9d4b-89e84610902a	CPL-09	Sikap	Mampu bertanggung jawab secara profesional dan mematuhi etika profesional terhadap masyarakat dalam merancang dan mengelola infrastruktur Teknik sumber daya air yang aman.	2025-12-17 22:17:02.305169	2025-12-17 22:17:02.305169	\N
0e3e0967-66fd-4956-9730-22d9a4ab8626	004feea9-5fb3-408c-9d4b-89e84610902a	CPL-10	Sikap	Mampu menyadari pentingnya pembelajaran sepanjang hayat dengan menerapkan Al Islam Kemuhammadiyahan dan terus mengakses pengetahuan terbaru dan isu yang sejalan dengan perkembangan zaman di bidang sumber daya air.	2025-12-17 22:17:02.309549	2025-12-17 22:17:02.309549	\N
\.


--
-- Data for Name: cpl_indikator; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cpl_indikator (id, cpl_id, indikator_kerja, urutan, created_at, updated_at, deleted_at) FROM stdin;
b9a34466-32e9-4639-aec3-6dd5d49ad7bd	d834cc3f-141e-4eeb-955a-151756cb7ebe	Mahasiswa mampu menjelaskan konsep-konsep dasar matematika  yang diperlukan dalam analisis sistem sumber daya air.	1	2025-12-17 22:17:02.272664	2025-12-17 22:17:02.272664	\N
e511f0ee-14ea-482a-a3e0-233a20b1941f	d834cc3f-141e-4eeb-955a-151756cb7ebe	Mahasiswa mampu menerapkan prinsip fisika dan kimia untuk menjelaskan fenomena air, seperti sifat fluida, perubahan fase, dan interaksi airâ€“material.	2	2025-12-17 22:17:02.275626	2025-12-17 22:17:02.275626	\N
4e30573b-66e4-4398-b6d5-9298cebf5ea9	d834cc3f-141e-4eeb-955a-151756cb7ebe	Mahasiswa mampu mengaplikasikan konsep ilmu alam untuk memahami proses-proses di lingkungan	3	2025-12-17 22:17:02.276918	2025-12-17 22:17:02.276918	\N
876fe31e-fdf2-4caa-91f9-292d8b92e8d7	d834cc3f-141e-4eeb-955a-151756cb7ebe	Mahasiswa dapat menerapkan pendekatan kuantitatif dalam pemecahan masalah sederhana pada bidang sumber daya air.	4	2025-12-17 22:17:02.277656	2025-12-17 22:17:02.277656	\N
ddb8d100-0f15-40be-90f6-2ae33bee5f04	925ecece-172a-4ca2-a85d-43be3a6d02de	Mahasiswa mampu mengidentifikasi kebutuhan dan tujuan perancangan sistem jaringan bangunan air berdasarkan kondisi lapangan dan data teknis.	1	2025-12-17 22:17:02.279513	2025-12-17 22:17:02.279513	\N
2e801d23-865e-40f6-818d-4a19c3d7cab9	925ecece-172a-4ca2-a85d-43be3a6d02de	Mahasiswa mampu merancang sistem yang berorientasi pada keberlanjutan dengan mempertimbangkan efisiensi air, energi, dampak jangka panjang, dan ketahanan iklim.	2	2025-12-17 22:17:02.28029	2025-12-17 22:17:02.28029	\N
9b79e8c5-986b-4f0b-881e-f9afef84d0b8	925ecece-172a-4ca2-a85d-43be3a6d02de	Mahasiswa mampu menghasilkan alternatif desain jaringan bangunan air yang memenuhi persyaratan teknis sekaligus seimbang dalam aspek hukum, ekonomi, lingkungan, sosial, dan politik.	3	2025-12-17 22:17:02.281062	2025-12-17 22:17:02.281062	\N
4c1fbd5a-af09-43ce-a729-75ff1a5d93db	925ecece-172a-4ca2-a85d-43be3a6d02de	Mahasiswa mampu mempertimbangkan potensi dan standar nasional dalam perencanaan, serta membandingkan dengan praktik dan referensi internasional.	4	2025-12-17 22:17:02.281687	2025-12-17 22:17:02.281687	\N
720f8291-0bb9-4648-bfc6-e0f1be2ab7ef	dcc77232-341e-4693-a297-7b002f2ae4f7	Mahasiswa mampu melakukan pengukuran lapangan (debit, kualitas air, geometri saluran, permeabilitas tanah, curah hujan, muka air tanah) dengan metode yang benar.	1	2025-12-17 22:17:02.283279	2025-12-17 22:17:02.283279	\N
fc5b7d22-4087-440b-bdd1-99c101355427	dcc77232-341e-4693-a297-7b002f2ae4f7	Mahasiswa mampu mengumpulkan dan mencatat data secara akurat menggunakan instrumen pengukuran dan lembar observasi yang sesuai.	2	2025-12-17 22:17:02.283838	2025-12-17 22:17:02.283838	\N
090673a4-a6a6-4e31-9062-82a325c7ad1a	dcc77232-341e-4693-a297-7b002f2ae4f7	Mahasiswa mampu melakukan pengolahan data (statistik dasar, regresi, kalibrasi, analisis grafik) menggunakan software atau alat analisis numerik.	3	2025-12-17 22:17:02.284405	2025-12-17 22:17:02.284405	\N
41985b4d-5668-410e-9bc6-6a803c545b7f	dcc77232-341e-4693-a297-7b002f2ae4f7	Mahasiswa mampu menginterpretasikan data secara ilmiah untuk menyimpulkan kondisi sistem sumber daya air atau menjawab tujuan penelitian/perancangan.	4	2025-12-17 22:17:02.284974	2025-12-17 22:17:02.284974	\N
947ec4d6-61b6-4c35-ad01-ac87be52c9ad	dcc77232-341e-4693-a297-7b002f2ae4f7	Mahasiswa mampu menganalisis hasil eksperimen atau pengamatan untuk mengevaluasi fenomena hidrologi atau hidraulika.	5	2025-12-17 22:17:02.285837	2025-12-17 22:17:02.285837	\N
3d86ec50-f22f-4bbd-a866-2e50798873f7	55fa90d7-6154-4155-a1cc-426581ccab60	Mahasiswa mampu mengidentifikasi permasalahan kompleks terkait hidrologi, hidraulika, pengelolaan air, lingkungan air, atau bangunan air berdasarkan data lapangan, studi literatur, atau fenomena aktual.	1	2025-12-17 22:17:02.287832	2025-12-17 22:17:02.287832	\N
812ed191-e526-480e-883d-87690f909577	55fa90d7-6154-4155-a1cc-426581ccab60	Mahasiswa mampu melakukan analisis data dan informasi teknis menggunakan metode kuantitatif maupun kualitatif untuk memahami akar masalah.	2	2025-12-17 22:17:02.288444	2025-12-17 22:17:02.288444	\N
f77b1f4a-6502-42cf-9d02-af142a102b7c	55fa90d7-6154-4155-a1cc-426581ccab60	Mahasiswa mampu memvalidasi hasil analisis atau pemodelan dengan membandingkan terhadap data lapangan, hasil eksperimen, atau referensi teknis yang tersedia.	3	2025-12-17 22:17:02.289061	2025-12-17 22:17:02.289061	\N
67494d7e-e949-41e8-b04b-f1cbbd40ff02	55fa90d7-6154-4155-a1cc-426581ccab60	Mahasiswa mampu merumuskan masalah secara jelas dan spesifik, termasuk batasan (constraints), asumsi, variabel, dan tujuan pemecahan masalah.	4	2025-12-17 22:17:02.289735	2025-12-17 22:17:02.289735	\N
7f391070-c6b7-4a05-bf8f-636c2d3b5126	2e19d414-c379-4e7e-87c9-4d7150430840	Mahasiswa mampu melakukan pemodelan hidrologi dan hidraulika menggunakan metode modern, termasuk simulasi aliran, banjir, jaringan pipa, atau kualitas air.	1	2025-12-17 22:17:02.291665	2025-12-17 22:17:02.291665	\N
08b0bb59-74a1-4a8b-b271-25a47e738d71	2e19d414-c379-4e7e-87c9-4d7150430840	Mahasiswa mampu menggunakan perangkat lunak teknis seperti HEC-RAS, HEC-HMS, EPANET, SWMM, ArcGIS/QGIS, atau CFD tools untuk menyelesaikan permasalahan sumber daya air.	2	2025-12-17 22:17:02.292405	2025-12-17 22:17:02.292405	\N
7e0e2088-fadb-48f6-a1f3-0282623a53bf	2e19d414-c379-4e7e-87c9-4d7150430840	Mahasiswa mampu memilih metode analisis atau alat rekayasa yang tepat berdasarkan karakteristik permasalahan teknik sumber daya air.	3	2025-12-17 22:17:02.293035	2025-12-17 22:17:02.293035	\N
0b052539-f8e7-45cc-aaac-2dd7572722b8	2e19d414-c379-4e7e-87c9-4d7150430840	Mahasiswa mampu menerapkan prinsip efisiensi dan efektivitas dalam penggunaan perangkat lunak dan alat rekayasa modern.	4	2025-12-17 22:17:02.293784	2025-12-17 22:17:02.293784	\N
25548b5f-ee74-4ea0-9930-2c34b0b3a351	b7a2c8c8-0359-4d1e-b693-64e5934d3521	Mahasiswa mampu menyusun laporan teknis, makalah, atau dokumen ilmiah dengan struktur yang sistematis, bahasa yang jelas, dan sesuai standar penulisan akademik/profesional.	1	2025-12-17 22:17:02.295777	2025-12-17 22:17:02.295777	\N
85307e26-4664-4d30-b1f7-0e76c0a3de4f	b7a2c8c8-0359-4d1e-b693-64e5934d3521	Mahasiswa mampu menggunakan media komunikasi modern untuk mendukung penyampaian informasi secara efektif.	2	2025-12-17 22:17:02.29642	2025-12-17 22:17:02.29642	\N
5b84acb4-af0b-4ae4-9ed4-3da53e8ae994	b7a2c8c8-0359-4d1e-b693-64e5934d3521	Mahasiswa mampu menggunakan bahasa Indonesia yang baik dan benar serta bahasa Inggris teknis yang memadai untuk keperluan akademik dan profesional.	3	2025-12-17 22:17:02.297045	2025-12-17 22:17:02.297045	\N
19a4ae19-3965-42a9-a049-c72519f1055f	22f2ab09-6ffe-4150-b39e-49bed078f0e5	Mahasiswa mampu mengidentifikasi tujuan dan ruang lingkup tugas teknik sumber daya air secara jelas sesuai batasan waktu, data, biaya, dan sumber daya.	1	2025-12-17 22:17:02.298708	2025-12-17 22:17:02.298708	\N
f57897c4-c84a-41ec-b7ab-308a32bf0d20	22f2ab09-6ffe-4150-b39e-49bed078f0e5	Mahasiswa mampu menyusun rencana kerja yang sistematis, termasuk penjadwalan, pembagian tugas, dan identifikasi kebutuhan teknis dalam penyelesaian pekerjaan.	2	2025-12-17 22:17:02.299344	2025-12-17 22:17:02.299344	\N
850f2b1d-8684-43b3-a5df-d4d7bd3dbd6d	22f2ab09-6ffe-4150-b39e-49bed078f0e5	Mahasiswa mampu mengevaluasi hasil pekerjaan untuk memastikan kesesuaian dengan standar teknis, tujuan awal, dan batasan yang ditetapkan.	3	2025-12-17 22:17:02.299997	2025-12-17 22:17:02.299997	\N
d4873172-9e38-4405-bf81-902f22958e1b	22f2ab09-6ffe-4150-b39e-49bed078f0e5	Mahasiswa mampu memberikan rekomendasi perbaikan berdasarkan hasil evaluasi teknis dan pertimbangan praktis.	4	2025-12-17 22:17:02.300649	2025-12-17 22:17:02.300649	\N
dac71af6-e7f0-410a-92de-6984a9045d18	c13ba416-aace-4587-8cd3-fcd9db568177	Mahasiswa mampu bekerja dalam tim dan berkomunikasi secara profesional dengan anggota tim maupun pihak terkait untuk menyelesaikan tugas teknik.	1	2025-12-17 22:17:02.302293	2025-12-17 22:17:02.302293	\N
1aa9cc05-d8a5-4e09-b832-db4549fa2e3b	c13ba416-aace-4587-8cd3-fcd9db568177	Mahasiswa mampu berperan aktif dalam tim dengan mengambil tanggung jawab yang jelas sesuai kompetensi masing-masing anggota.	2	2025-12-17 22:17:02.302901	2025-12-17 22:17:02.302901	\N
0ce778f4-162f-44de-873a-5b3078a4d899	c13ba416-aace-4587-8cd3-fcd9db568177	Mahasiswa mampu berkontribusi dalam pengambilan keputusan tim secara kolaboratif dan demokratis.	3	2025-12-17 22:17:02.303485	2025-12-17 22:17:02.303485	\N
fbfea19e-1822-49d8-9b53-d2a38a218c8b	c13ba416-aace-4587-8cd3-fcd9db568177	Mahasiswa mampu bekerja sama dengan pihak luar (masyarakat, pemerintah, praktisi) yang memiliki latar belakang sosial dan budaya beragam dalam proyek teknik.	4	2025-12-17 22:17:02.304182	2025-12-17 22:17:02.304182	\N
320aacbf-1d0c-4d74-a088-0c737506c14c	8e1473c1-3caa-4a1f-aefb-3138033a2642	Mahasiswa mampu menunjukkan etika komunikasi profesional, termasuk kejelasan sumber data, pengakuan kontribusi pihak lain, dan penyampaian informasi secara objektif.	1	2025-12-17 22:17:02.305833	2025-12-17 22:17:02.305833	\N
493c2097-035b-4b34-9d93-9f870d1fb202	8e1473c1-3caa-4a1f-aefb-3138033a2642	Mahasiswa mampu bekerja secara mandiri maupun dalam tim untuk menyelesaikan tugas sesuai batasan yang ada, sambil menjaga profesionalisme dan etika kerja.	2	2025-12-17 22:17:02.306523	2025-12-17 22:17:02.306523	\N
c7f2b296-d851-4066-8df8-27ebed96368a	2cd99a5b-c36b-4d6d-af83-772a01a5860e	Mahasiswa mampu bekerja dalam tim dan berkomunikasi secara profesional dengan anggota tim maupun pihak terkait untuk menyelesaikan tugas teknik.	1	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
f3800cbf-e806-4a37-b714-42563ade9914	8e1473c1-3caa-4a1f-aefb-3138033a2642	Mahasiswa mampu mematuhi standar, regulasi, dan kode etik profesi seperti peraturan pemerintah, SNI, pedoman teknis, dan standar internasional yang relevan.	3	2025-12-17 22:17:02.307266	2025-12-17 22:17:02.307266	\N
efb75b28-0603-4997-a012-19ba128edabe	8e1473c1-3caa-4a1f-aefb-3138033a2642	Mahasiswa mampu menghindari praktik tidak etis, seperti manipulasi data, plagiarisme, konflik kepentingan, atau penggunaan metode yang tidak aman.	4	2025-12-17 22:17:02.307944	2025-12-17 22:17:02.307944	\N
42251462-3d0c-4781-adda-ab1e0fa04471	8e1473c1-3caa-4a1f-aefb-3138033a2642	Mahasiswa mampu mempertahankan integritas profesional saat menghadapi tekanan atau pengaruh eksternal dalam proses perancangan atau pengelolaan infrastruktur air.	5	2025-12-17 22:17:02.308558	2025-12-17 22:17:02.308558	\N
488e8d2a-286f-487a-8b98-254a5ea556ac	0e3e0967-66fd-4956-9730-22d9a4ab8626	Mahasiswa mampu menunjukkan sikap dan perilaku yang mencerminkan nilai-nilai Al Islam Kemuhammadiyahan (kejujuran, amanah, disiplin, tanggung jawab, dan etos kerja) dalam aktivitas akademik dan profesi.	1	2025-12-17 22:17:02.310199	2025-12-17 22:17:02.310199	\N
72b6893e-dda1-4a7b-8ab4-eadb4572c7d0	0e3e0967-66fd-4956-9730-22d9a4ab8626	Mahasiswa mampu mengikuti perkembangan isu-isu global dan nasional, seperti perubahan iklim, ketahanan air, teknologi digital, dan keberlanjutan.	2	2025-12-17 22:17:02.310818	2025-12-17 22:17:02.310818	\N
f8a0f9a5-94cf-411b-b40c-69a209c4fa11	0e3e0967-66fd-4956-9730-22d9a4ab8626	Mahasiswa mampu menerapkan prinsip Al Islam Kemuhammadiyahan dalam pengambilan keputusan akademik dan profesional, termasuk menjunjung etika, kemaslahatan, dan tanggung jawab sosial.	3	2025-12-17 22:17:02.311377	2025-12-17 22:17:02.311377	\N
4ed08a43-07f9-45d2-b395-364d4090d5f3	44609009-6d62-445b-b5e6-eb22eea2e66a	Mahasiswa mampu menjelaskan konsep-konsep dasar matematika  yang diperlukan dalam analisis sistem sumber daya air.	1	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
f79a822d-7f72-41c4-b61a-83287ce3baa7	44609009-6d62-445b-b5e6-eb22eea2e66a	Mahasiswa mampu menerapkan prinsip fisika dan kimia untuk menjelaskan fenomena air, seperti sifat fluida, perubahan fase, dan interaksi airâ€“material.	2	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
f98ba341-53d8-4a80-8956-e73fa03215eb	44609009-6d62-445b-b5e6-eb22eea2e66a	Mahasiswa mampu mengaplikasikan konsep ilmu alam untuk memahami proses-proses di lingkungan	3	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
5aa9b990-eda2-4c9e-a150-fa1a971c3cf4	44609009-6d62-445b-b5e6-eb22eea2e66a	Mahasiswa dapat menerapkan pendekatan kuantitatif dalam pemecahan masalah sederhana pada bidang sumber daya air.	4	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
2bc5fd03-d7fd-45a0-8ed0-e4b76bf594ae	8f8b77a1-5e5f-463a-a1dc-5f3a25da2930	Mahasiswa mampu mengidentifikasi kebutuhan dan tujuan perancangan sistem jaringan bangunan air berdasarkan kondisi lapangan dan data teknis.	1	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
74d3f9d1-47c8-4bee-aec9-cfb735a5fe71	8f8b77a1-5e5f-463a-a1dc-5f3a25da2930	Mahasiswa mampu merancang sistem yang berorientasi pada keberlanjutan dengan mempertimbangkan efisiensi air, energi, dampak jangka panjang, dan ketahanan iklim.	2	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
3d6633cc-d862-4263-b1d6-35d3a21debfa	8f8b77a1-5e5f-463a-a1dc-5f3a25da2930	Mahasiswa mampu menghasilkan alternatif desain jaringan bangunan air yang memenuhi persyaratan teknis sekaligus seimbang dalam aspek hukum, ekonomi, lingkungan, sosial, dan politik.	3	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
ca99925e-e071-4f25-be19-f2e87acf606b	8f8b77a1-5e5f-463a-a1dc-5f3a25da2930	Mahasiswa mampu mempertimbangkan potensi dan standar nasional dalam perencanaan, serta membandingkan dengan praktik dan referensi internasional.	4	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
3015dc81-622b-438e-bed7-3962e61c3dd0	4a877687-0b38-4b7c-8a8e-0b48f328b995	Mahasiswa mampu melakukan pengukuran lapangan (debit, kualitas air, geometri saluran, permeabilitas tanah, curah hujan, muka air tanah) dengan metode yang benar.	1	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
79f78d9c-479d-45c8-9e42-38dee15e2c04	4a877687-0b38-4b7c-8a8e-0b48f328b995	Mahasiswa mampu mengumpulkan dan mencatat data secara akurat menggunakan instrumen pengukuran dan lembar observasi yang sesuai.	2	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
c75523e4-315b-45c1-a3d7-ab85c9e27469	4a877687-0b38-4b7c-8a8e-0b48f328b995	Mahasiswa mampu melakukan pengolahan data (statistik dasar, regresi, kalibrasi, analisis grafik) menggunakan software atau alat analisis numerik.	3	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
d942d7ac-25de-48d8-bc12-89f26e3d90e4	4a877687-0b38-4b7c-8a8e-0b48f328b995	Mahasiswa mampu menginterpretasikan data secara ilmiah untuk menyimpulkan kondisi sistem sumber daya air atau menjawab tujuan penelitian/perancangan.	4	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
f0d3cf5d-93bc-4c79-b3da-a725e01b2c8e	4a877687-0b38-4b7c-8a8e-0b48f328b995	Mahasiswa mampu menganalisis hasil eksperimen atau pengamatan untuk mengevaluasi fenomena hidrologi atau hidraulika.	5	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
b8c691d2-33c3-4607-90c2-8f2063c64d17	4e0c3607-89f5-4258-8fd1-25c811658997	Mahasiswa mampu mengidentifikasi permasalahan kompleks terkait hidrologi, hidraulika, pengelolaan air, lingkungan air, atau bangunan air berdasarkan data lapangan, studi literatur, atau fenomena aktual.	1	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
5ec16539-34aa-4c5a-81e8-97d8ef689ed1	4e0c3607-89f5-4258-8fd1-25c811658997	Mahasiswa mampu melakukan analisis data dan informasi teknis menggunakan metode kuantitatif maupun kualitatif untuk memahami akar masalah.	2	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
b809a554-150a-4d62-91e4-07a922166d4d	4e0c3607-89f5-4258-8fd1-25c811658997	Mahasiswa mampu memvalidasi hasil analisis atau pemodelan dengan membandingkan terhadap data lapangan, hasil eksperimen, atau referensi teknis yang tersedia.	3	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
9f780e81-57c5-4785-ba66-2ad11dc7c87d	4e0c3607-89f5-4258-8fd1-25c811658997	Mahasiswa mampu merumuskan masalah secara jelas dan spesifik, termasuk batasan (constraints), asumsi, variabel, dan tujuan pemecahan masalah.	4	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
cf7e24d5-5abf-4faf-b657-015d80a3a950	28c190e5-b777-42f8-a3d1-c4ff54d88eb3	Mahasiswa mampu melakukan pemodelan hidrologi dan hidraulika menggunakan metode modern, termasuk simulasi aliran, banjir, jaringan pipa, atau kualitas air.	1	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
b4de1cc7-78e1-437e-bc64-5da063a67cab	28c190e5-b777-42f8-a3d1-c4ff54d88eb3	Mahasiswa mampu menggunakan perangkat lunak teknis seperti HEC-RAS, HEC-HMS, EPANET, SWMM, ArcGIS/QGIS, atau CFD tools untuk menyelesaikan permasalahan sumber daya air.	2	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
6b05a76c-3cb6-4ed2-834a-1e5b15af242d	28c190e5-b777-42f8-a3d1-c4ff54d88eb3	Mahasiswa mampu memilih metode analisis atau alat rekayasa yang tepat berdasarkan karakteristik permasalahan teknik sumber daya air.	3	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
df412395-61d5-4296-9e04-c9dd8a299558	28c190e5-b777-42f8-a3d1-c4ff54d88eb3	Mahasiswa mampu menerapkan prinsip efisiensi dan efektivitas dalam penggunaan perangkat lunak dan alat rekayasa modern.	4	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
d949b05c-e06c-4522-9b64-f5d8353c5142	c745dd6d-53ef-4219-a9ea-f58409cab75c	Mahasiswa mampu menyusun laporan teknis, makalah, atau dokumen ilmiah dengan struktur yang sistematis, bahasa yang jelas, dan sesuai standar penulisan akademik/profesional.	1	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
fcb2693a-27dc-4bfe-93e1-73e9a33c3449	c745dd6d-53ef-4219-a9ea-f58409cab75c	Mahasiswa mampu menggunakan media komunikasi modern untuk mendukung penyampaian informasi secara efektif.	2	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
4ecb1845-d701-4559-81a7-dc1ffc7af9ae	c745dd6d-53ef-4219-a9ea-f58409cab75c	Mahasiswa mampu menggunakan bahasa Indonesia yang baik dan benar serta bahasa Inggris teknis yang memadai untuk keperluan akademik dan profesional.	3	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
f7a53aa6-61ff-4665-b203-f0b9d2fb0266	233b65f5-eb5c-4aca-8573-5ba224c45b0d	Mahasiswa mampu mengidentifikasi tujuan dan ruang lingkup tugas teknik sumber daya air secara jelas sesuai batasan waktu, data, biaya, dan sumber daya.	1	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
7390d356-c16d-4e62-850f-e144665a9871	233b65f5-eb5c-4aca-8573-5ba224c45b0d	Mahasiswa mampu menyusun rencana kerja yang sistematis, termasuk penjadwalan, pembagian tugas, dan identifikasi kebutuhan teknis dalam penyelesaian pekerjaan.	2	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
2725b4e1-cdfa-4788-94ca-1f02ed42ed68	233b65f5-eb5c-4aca-8573-5ba224c45b0d	Mahasiswa mampu mengevaluasi hasil pekerjaan untuk memastikan kesesuaian dengan standar teknis, tujuan awal, dan batasan yang ditetapkan.	3	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
986be57d-730b-4083-926d-a15645cf05e6	233b65f5-eb5c-4aca-8573-5ba224c45b0d	Mahasiswa mampu memberikan rekomendasi perbaikan berdasarkan hasil evaluasi teknis dan pertimbangan praktis.	4	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
23bb57da-8d82-4859-beca-48fff963aacb	2cd99a5b-c36b-4d6d-af83-772a01a5860e	Mahasiswa mampu berperan aktif dalam tim dengan mengambil tanggung jawab yang jelas sesuai kompetensi masing-masing anggota.	2	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
7b873ef2-13d2-40fd-b44b-d52571d26a31	2cd99a5b-c36b-4d6d-af83-772a01a5860e	Mahasiswa mampu berkontribusi dalam pengambilan keputusan tim secara kolaboratif dan demokratis.	3	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
b4b7262f-30f0-416d-a5d8-6b4261513778	2cd99a5b-c36b-4d6d-af83-772a01a5860e	Mahasiswa mampu bekerja sama dengan pihak luar (masyarakat, pemerintah, praktisi) yang memiliki latar belakang sosial dan budaya beragam dalam proyek teknik.	4	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
9c4926ef-e9bf-4fa9-8666-d91bc4726490	f348555d-8d02-4f52-b808-2958ad534032	Mahasiswa mampu menunjukkan etika komunikasi profesional, termasuk kejelasan sumber data, pengakuan kontribusi pihak lain, dan penyampaian informasi secara objektif.	1	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
9414b901-b20d-471f-a557-8485408b3059	f348555d-8d02-4f52-b808-2958ad534032	Mahasiswa mampu bekerja secara mandiri maupun dalam tim untuk menyelesaikan tugas sesuai batasan yang ada, sambil menjaga profesionalisme dan etika kerja.	2	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
e1736241-8777-4f8a-9d14-2b58a38b727d	f348555d-8d02-4f52-b808-2958ad534032	Mahasiswa mampu mematuhi standar, regulasi, dan kode etik profesi seperti peraturan pemerintah, SNI, pedoman teknis, dan standar internasional yang relevan.	3	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
bf6f6004-2623-44d7-b18b-8d5052283794	f348555d-8d02-4f52-b808-2958ad534032	Mahasiswa mampu menghindari praktik tidak etis, seperti manipulasi data, plagiarisme, konflik kepentingan, atau penggunaan metode yang tidak aman.	4	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
5540fe3a-9f4d-43f4-9ce9-0e92b6bde1db	f348555d-8d02-4f52-b808-2958ad534032	Mahasiswa mampu mempertahankan integritas profesional saat menghadapi tekanan atau pengaruh eksternal dalam proses perancangan atau pengelolaan infrastruktur air.	5	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
c40b77ce-4f3f-49cf-9a24-3d051abe32c0	e99e818e-3517-46e6-9331-c19d0fefd036	Mahasiswa mampu menunjukkan sikap dan perilaku yang mencerminkan nilai-nilai Al Islam Kemuhammadiyahan (kejujuran, amanah, disiplin, tanggung jawab, dan etos kerja) dalam aktivitas akademik dan profesi.	1	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
5dc159c6-521f-415b-8bba-a7064236e764	e99e818e-3517-46e6-9331-c19d0fefd036	Mahasiswa mampu mengikuti perkembangan isu-isu global dan nasional, seperti perubahan iklim, ketahanan air, teknologi digital, dan keberlanjutan.	2	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
fef34518-51b7-48a5-a082-f51039a3d585	e99e818e-3517-46e6-9331-c19d0fefd036	Mahasiswa mampu menerapkan prinsip Al Islam Kemuhammadiyahan dalam pengambilan keputusan akademik dan profesional, termasuk menjunjung etika, kemaslahatan, dan tanggung jawab sosial.	3	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
b1bd0512-2a31-4b33-afac-cafc91bc9fea	e99e818e-3517-46e6-9331-c19d0fefd036	Mahasiswa mampu mengintegrasikan nilai spiritual, moral, dan kemanusiaan dalam memandang tantangan teknis dan sosial di bidang sumber daya air.	4	2025-12-17 18:59:36.900516	2025-12-17 18:59:36.900516	\N
4fae69c1-2379-465a-aa81-87d2abda07d0	0e3e0967-66fd-4956-9730-22d9a4ab8626	Mahasiswa mampu mengintegrasikan nilai spiritual, moral, dan kemanusiaan dalam memandang tantangan teknis dan sosial di bidang sumber daya air.	4	2025-12-17 22:17:02.311975	2025-12-17 22:17:02.311975	\N
\.


--
-- Data for Name: cpmk; Type: TABLE DATA; Schema: public; Owner: smart_rps_user
--

COPY public.cpmk (id, course_id, cpmk_number, description, created_at, updated_at, deleted_at) FROM stdin;
45ef4da9-bba5-4d60-a557-de0c555b6096	a282cd65-55b7-46c5-9f6c-90cc3a10286f	1	Mahasiswa mampu menjelaskan nilai, prinsip, dan sistem etika Pancasila dalam kehidupan berbangsa dan bernegara. (CPL 09)	2025-12-17 22:53:20.696303	2025-12-17 22:53:20.696303	2025-12-18 01:05:13.131474
dab6ffc2-03fd-461a-8cb0-5242129eeaab	a282cd65-55b7-46c5-9f6c-90cc3a10286f	2	Mahasiswa mampu menganalisis persoalan sosial dan profesional menggunakan perspektif etika Pancasila. (CPL 08)	2025-12-17 22:53:20.697134	2025-12-17 22:53:20.697134	2025-12-18 01:05:13.131474
47dc02bc-458b-4777-a90e-8b866b634da0	a282cd65-55b7-46c5-9f6c-90cc3a10286f	3	Mahasiswa mampu menunjukkan sikap integritas, moralitas, dan tanggung jawab sosial dalam aktivitas akademik. (CPL 09)	2025-12-17 22:53:20.698099	2025-12-17 22:53:20.698099	2025-12-18 01:05:13.131474
f9cdb66d-e993-463e-aad8-d164739ee535	a282cd65-55b7-46c5-9f6c-90cc3a10286f	4	Mahasiswa mampu menerapkan nilai-nilai Pancasila sebagai dasar pengambilan keputusan yang adil dan berkeadilan sosial. (CPL 08)	2025-12-17 22:53:20.698832	2025-12-17 22:53:20.698832	2025-12-18 01:05:13.131474
08042305-1884-462e-b9db-05f0b39d7a4c	8c7b796e-6bf7-4f51-b8fd-f5831900298b	1	Menjelaskan konsep limit dan kontinuitas fungsi satu variabel. (CPL 01)	2025-12-17 22:53:20.70059	2025-12-17 22:53:20.70059	2025-12-18 01:05:13.136144
644d0608-d256-4810-a573-62278f8d25a3	8c7b796e-6bf7-4f51-b8fd-f5831900298b	2	Menerapkan aturan turunan dalam menyelesaikan persoalan teknik. CPL 01)	2025-12-17 22:53:20.701385	2025-12-17 22:53:20.701385	2025-12-18 01:05:13.136144
fb43bf99-638d-4772-9f36-9d4029aa7a06	8c7b796e-6bf7-4f51-b8fd-f5831900298b	3	Menganalisis grafik fungsi menggunakan turunan pertama dan kedua. (CPL 04)	2025-12-17 22:53:20.702108	2025-12-17 22:53:20.702108	2025-12-18 01:05:13.136144
9b658cc3-f8c9-4921-9cdc-d76868d5a733	8c7b796e-6bf7-4f51-b8fd-f5831900298b	4	Menghitung integral tak tentu dan tertentu dari fungsi polinomial. (CPL 04)	2025-12-17 22:53:20.702721	2025-12-17 22:53:20.702721	2025-12-18 01:05:13.136144
a75414eb-a7d9-4ab6-8a06-0c1e4477901f	8c7b796e-6bf7-4f51-b8fd-f5831900298b	5	Menyusun model matematika sederhana (CPL 04)	2025-12-17 22:53:20.703304	2025-12-17 22:53:20.703304	2025-12-18 01:05:13.136144
211a4991-e833-428e-8d6a-17d1992f1b9a	036843d8-177a-4b11-8928-1d560a7b4d1d	1	Mahasiswa mampu menyusun tulisan ilmiah yang efektif, logis, dan sesuai kaidah bahasa Indonesia akademik. (CPL 06)	2025-12-17 22:53:20.704928	2025-12-17 22:53:20.704928	2025-12-18 01:05:13.140924
1e5101bc-fb0e-4f06-a664-ec1b34d36e1d	036843d8-177a-4b11-8928-1d560a7b4d1d	2	Mahasiswa mampu mengevaluasi penggunaan bahasa dalam laporan, makalah, dan tulisan sumber daya air secara profesional.	2025-12-17 22:53:20.705575	2025-12-17 22:53:20.705575	2025-12-18 01:05:13.140924
1599a76e-9dd2-4507-8536-ade7b2f64fd6	036843d8-177a-4b11-8928-1d560a7b4d1d	3	Mahasiswa mampu berkomunikasi secara tertulis untuk menyampaikan ide sumber daya air secara informatif dan etis.	2025-12-17 22:53:20.70626	2025-12-17 22:53:20.70626	2025-12-18 01:05:13.140924
1283b7d6-0cf4-42f0-9539-bcaac3642e94	20ee1278-a3ba-4e5a-8cdd-243629c31a56	1	memahami informasi lisan dalam percakapan sehari-hari dan situasi umum, seperti percakapan sosial, instruksi sederhana, dan dialog akademik dasar (CPL 06)	2025-12-17 22:53:20.708281	2025-12-17 22:53:20.708281	2025-12-18 01:05:13.147597
adc22548-e76f-4902-b0cd-bd8ac0333e36	20ee1278-a3ba-4e5a-8cdd-243629c31a56	2	membaca dan memahami teks bahasa Inggris umum, seperti artikel pendek, deskripsi, email, dan teks informatif, serta mengidentifikasi ide pokok, detail penting, dan makna kosakata dalam konteks (CPL 06)	2025-12-17 22:53:20.708939	2025-12-17 22:53:20.708939	2025-12-18 01:05:13.147597
9be9c86a-ed5c-4b1e-ad48-fb35c4d2726c	20ee1278-a3ba-4e5a-8cdd-243629c31a56	3	menulis kalimat dan paragraf sederhana dalam bahasa Inggris secara jelas dan koheren (CPL 06)	2025-12-17 22:53:20.709601	2025-12-17 22:53:20.709601	2025-12-18 01:05:13.147597
7be70e37-e294-4405-974f-2ce67b916a02	39ff239d-95de-4729-a5ff-ff416e88808a	1	menjelaskan komponen dasar sistem komputer, termasuk perangkat keras, perangkat lunak, sistem operasi, penyimpanan data (CPL 01)	2025-12-17 22:53:20.712139	2025-12-17 22:53:20.712139	2025-12-18 01:05:13.152364
b2caed42-eb05-4c6d-9c7a-e3126e4777d3	39ff239d-95de-4729-a5ff-ff416e88808a	2	mengoperasikan sistem operasi (Windows/Linux) untuk melakukan manajemen file, pengaturan dasar, instalasi sederhana, dan navigasi perangkat komputer secara efektif (CPL 05)	2025-12-17 22:53:20.713037	2025-12-17 22:53:20.713037	2025-12-18 01:05:13.152364
91fbbc52-2b27-40be-b9c8-b68c902c1ffb	39ff239d-95de-4729-a5ff-ff416e88808a	3	menggunakan aplikasi perkantoran dasar (word processing, spreadsheet, dan presentation) untuk membuat dokumen tekstual, tabel data, grafik sederhana, dan presentasi sesuai standar akademik (CPL 05)	2025-12-17 22:53:20.713924	2025-12-17 22:53:20.713924	2025-12-18 01:05:13.152364
50affa97-84ea-42c0-b227-b22a7a155f12	39ff239d-95de-4729-a5ff-ff416e88808a	4	Menggunakan internet, mesin pencari, email, dan platform digital secara efektif serta memahami etika digital, keamanan siber dasar, dan penggunaan teknologi secara bertanggung jawab (CPL 05)	2025-12-17 22:53:20.71465	2025-12-17 22:53:20.71465	2025-12-18 01:05:13.152364
f1f0ad9f-67ad-4767-b248-f920ef749ff5	1758d5ea-1a7a-48ee-8f4e-826e4b9c0775	1	Menjelaskan konsep kinematika gerak lurus dan gerak melingkar. (CPL 01)	2025-12-17 22:53:20.716001	2025-12-17 22:53:20.716001	2025-12-18 01:05:13.156402
ab30fd49-7ad5-4505-a823-9ae321ca976b	1758d5ea-1a7a-48ee-8f4e-826e4b9c0775	2	Menganalisis masalah dinamika menggunakan hukum Newton. (CPL 04)	2025-12-17 22:53:20.716661	2025-12-17 22:53:20.716661	2025-12-18 01:05:13.156402
8728aeb6-b944-4148-ac6d-e0371a10255c	1758d5ea-1a7a-48ee-8f4e-826e4b9c0775	3	Menghitung usaha, energi kinetik, energi potensial, dan penerapannya. (CPL 04)	2025-12-17 22:53:20.717283	2025-12-17 22:53:20.717283	2025-12-18 01:05:13.156402
44d1465e-f39f-4b36-8c13-3e9252794991	1758d5ea-1a7a-48ee-8f4e-826e4b9c0775	4	Menganalisis tumbukan dan hukum kekekalan momentum. (CPL 04)	2025-12-17 22:53:20.717893	2025-12-17 22:53:20.717893	2025-12-18 01:05:13.156402
9c6aae6a-ad03-40cd-a536-7d7e6dd666a9	1758d5ea-1a7a-48ee-8f4e-826e4b9c0775	5	Menjelaskan konsep getaran dan gelombang serta aplikasinya. (CPL 01)	2025-12-17 22:53:20.718567	2025-12-17 22:53:20.718567	2025-12-18 01:05:13.156402
9c8be098-ebd1-4b06-9582-6d6df12f8f30	3b97e512-deac-437f-a7af-0a5adb890730	1	Menjelaskan prinsip dan standar dalam gambar teknik. (CPL 02)	2025-12-17 22:53:20.720023	2025-12-17 22:53:20.720023	2025-12-18 01:05:13.162038
d0193715-6f03-4bc3-abc7-51e5ec138e8c	3b97e512-deac-437f-a7af-0a5adb890730	2	Menggambar proyeksi ortogonal dan tampak potongan bangunan teknik secara manual. (CPL 02)	2025-12-17 22:53:20.720653	2025-12-17 22:53:20.720653	2025-12-18 01:05:13.162038
5552e50b-7a00-4ae1-bd8c-9708a8b45f25	3b97e512-deac-437f-a7af-0a5adb890730	3	Mengoperasikan perangkat lunak CAD (Computer Aided Design) dasar. (CPL 05)	2025-12-17 22:53:20.721287	2025-12-17 22:53:20.721287	2025-12-18 01:05:13.162038
bf822b66-a82e-4a88-bd55-3f5c530b45ff	3b97e512-deac-437f-a7af-0a5adb890730	4	Menganalisis gambar teknik dan mengoreksi kesalahan gambar. (CPL 02)	2025-12-17 22:53:20.721948	2025-12-17 22:53:20.721948	2025-12-18 01:05:13.162038
e7f5e67d-58b9-4cee-83ec-75d632e6852e	3b97e512-deac-437f-a7af-0a5adb890730	5	Mempresentasikan hasil gambar teknik secara komunikatif dan profesional. (CPL 05)	2025-12-17 22:53:20.722659	2025-12-17 22:53:20.722659	2025-12-18 01:05:13.162038
5058e6f2-128f-44fd-9ef7-228b55681e07	186aa49d-2f32-4047-a3ed-9c9f7eead726	1	Mahasiswa mampu menjelaskan konsep dasar ajaran Islam tentang akidah, ibadah, akhlak, dan moderasi beragama sesuai perspektif Muhammadiyah. (CPL 10)	2025-12-17 22:53:20.723963	2025-12-17 22:53:20.723963	2025-12-18 01:05:13.166651
e1fc53b8-7a09-4e41-ba1e-5d2fa87c0e28	186aa49d-2f32-4047-a3ed-9c9f7eead726	2	Mahasiswa mampu menganalisis nilai-nilai Islam dalam kehidupan sosial, budaya, dan profesional, serta keterkaitannya dengan pembangunan masyarakat. (CPL 10)	2025-12-17 22:53:20.724553	2025-12-17 22:53:20.724553	2025-12-18 01:05:13.166651
c6a45d74-6d74-443c-8b6a-044a42a1480d	186aa49d-2f32-4047-a3ed-9c9f7eead726	3	Mahasiswa mampu menerapkan prinsip etika Islam, integritas, dan tanggung jawab sosial dalam aktivitas akademik dan interaksi profesional. (CPL 10)	2025-12-17 22:53:20.725218	2025-12-17 22:53:20.725218	2025-12-18 01:05:13.166651
39999d75-5087-4a19-9f58-d966ab245779	186aa49d-2f32-4047-a3ed-9c9f7eead726	4	Mahasiswa mampu menginterpretasikan nilai dan pemikiran Muhammadiyah dalam merumuskan solusi terhadap isu kemasyarakatan dan tantangan kontemporer. (CPL 08)	2025-12-17 22:53:20.725884	2025-12-17 22:53:20.725884	2025-12-18 01:05:13.166651
1ed4cb76-6a30-4453-949b-e37a65055ba8	15cc2515-dd94-4c3e-a7fe-66066a7c18ea	1	Menjelaskan konsep gaya, momen, dan hukum kesetimbangan. (CPL 01)	2025-12-17 22:53:20.727225	2025-12-17 22:53:20.727225	2025-12-18 01:05:13.1705
407e6920-2a46-4390-81fc-f7e475fc3393	15cc2515-dd94-4c3e-a7fe-66066a7c18ea	2	Menghitung reaksi perletakan pada balok statis tertentu. (CPL 04)	2025-12-17 22:53:20.72784	2025-12-17 22:53:20.72784	2025-12-18 01:05:13.1705
7cf262c1-b74e-4b11-88c8-c832a38e72f1	e327f079-606a-453e-98f9-47b549931547	1	Menghitung integral tak tentu dan tentu dari fungsi satu dan multi variabel. (CPL 04)	2025-12-17 22:53:20.731382	2025-12-17 22:53:20.731382	2025-12-18 01:05:13.175986
18be795c-61da-456f-9717-44ac18ee718e	e327f079-606a-453e-98f9-47b549931547	2	Menyelesaikan persamaan diferensial orde satu dan orde dua. (CPL 04)	2025-12-17 22:53:20.731974	2025-12-17 22:53:20.731974	2025-12-18 01:05:13.175986
b4013803-fd7a-4f5d-a765-42b89f4c5188	e327f079-606a-453e-98f9-47b549931547	3	Menganalisis deret tak hingga dan deret Fourier. (CPL 04)	2025-12-17 22:53:20.732564	2025-12-17 22:53:20.732564	2025-12-18 01:05:13.175986
95b0af14-1c18-4af2-ae4a-422f546ad5eb	c31df656-5b43-49b8-adb7-d18b652a013d	1	Menjelaskan konsep dasar listrik statis dan medan listrik. (CPL 01)	2025-12-17 22:53:20.735483	2025-12-17 22:53:20.735483	2025-12-18 01:05:13.181842
34137489-19bc-41a2-91ba-6ea14b27aecc	c31df656-5b43-49b8-adb7-d18b652a013d	2	Menjelaskan konsep arus listrik, hukum Ohm, dan rangkaian listrik sederhana. (CPL 01)	2025-12-17 22:53:20.736248	2025-12-17 22:53:20.736248	2025-12-18 01:05:13.181842
71ef7fb7-adde-464d-8ed3-f8d0d9122162	c31df656-5b43-49b8-adb7-d18b652a013d	3	Menganalisis potensial listrik dan energi potensial muatan. (CPL 04)	2025-12-17 22:53:20.736965	2025-12-17 22:53:20.736965	2025-12-18 01:05:13.181842
b26234fc-6fa2-4a14-8d19-00a124a92acb	c31df656-5b43-49b8-adb7-d18b652a013d	4	Menganalisis konsep kemagnetan dan induksi elektromagnetik. (CPL 04)	2025-12-17 22:53:20.737675	2025-12-17 22:53:20.737675	2025-12-18 01:05:13.181842
fc06ec34-c704-4fa6-adb9-0ceffc353392	a128a351-b08f-4d99-9a34-5bf9133b4e8f	1	Menjelaskan sifat dan tekanan fluida dalam kondisi statis. (CPL 02)	2025-12-17 22:53:20.739721	2025-12-17 22:53:20.739721	2025-12-18 01:05:13.186541
46ecb72b-9972-49f1-a613-170c40f6d8b2	a128a351-b08f-4d99-9a34-5bf9133b4e8f	2	Menerapkan hukum kontinuitas dan energi dalam aliran fluida ideal. (CPL 05)	2025-12-17 22:53:20.74032	2025-12-17 22:53:20.74032	2025-12-18 01:05:13.186541
6500dc19-35a9-49cc-9c03-0c7ab92577ee	a128a351-b08f-4d99-9a34-5bf9133b4e8f	3	Menganalisis kehilangan energi dalam aliran fluida nyata. (CPL 05)	2025-12-17 22:53:20.741011	2025-12-17 22:53:20.741011	2025-12-18 01:05:13.186541
f7acc20d-8fc2-4ef7-a85e-e4866aa3a60c	a128a351-b08f-4d99-9a34-5bf9133b4e8f	4	Menghitung debit aliran pada saluran terbuka dan pipa bertekanan. (CPL 02)	2025-12-17 22:53:20.741677	2025-12-17 22:53:20.741677	2025-12-18 01:05:13.186541
041923fe-7520-4119-a62f-66940362765a	a128a351-b08f-4d99-9a34-5bf9133b4e8f	5	Menyusun laporan teknis analisis hidrolika dasar (CPL 02)	2025-12-17 22:53:20.742413	2025-12-17 22:53:20.742413	2025-12-18 01:05:13.186541
a98cb29d-3894-411f-8375-a36d7d25f342	a19f7c46-6f8f-44b2-82d6-374ce3af07b5	1	Mahasiswa mampu menjelaskan prinsip dasar kewarganegaraan, konstitusi, nilai Pancasila, dan sistem demokrasi Indonesia secara komprehensif.	2025-12-17 22:53:20.743935	2025-12-17 22:53:20.743935	2025-12-18 01:05:13.191211
d9c983f1-cdf1-4c43-8ebb-f6753d84580b	a19f7c46-6f8f-44b2-82d6-374ce3af07b5	2	Mahasiswa mampu menganalisis isu kebangsaan, hak dan kewajiban warga negara, serta tantangan multikulturalisme dalam konteks sosial Indonesia.	2025-12-17 22:53:20.744966	2025-12-17 22:53:20.744966	2025-12-18 01:05:13.191211
230338a4-e58c-42e4-87b6-70ad3fc72aa1	a19f7c46-6f8f-44b2-82d6-374ce3af07b5	3	Mahasiswa mampu menunjukkan sikap etis, toleran, bertanggung jawab, serta kesadaran berbangsa dan bernegara dalam kehidupan sosial.	2025-12-17 22:53:20.745728	2025-12-17 22:53:20.745728	2025-12-18 01:05:13.191211
9152a9f4-5025-4e02-b4ee-f6628ae7581a	d45f6a86-d4c3-41f0-9046-a6dc973001eb	1	Mahasiswa mampu memahami dan menggunakan kosakata teknis sumber daya air dalam bahasa Inggris. (CPL 10)	2025-12-17 22:53:20.747909	2025-12-17 22:53:20.747909	2025-12-18 01:05:13.196477
77b573d2-65ca-4dca-92f8-b1404537bc2f	d45f6a86-d4c3-41f0-9046-a6dc973001eb	2	Mahasiswa mampu menulis paragraf teknis, deskripsi desain, dan laporan pendek dalam bahasa Inggris akademik. (CPL 06)	2025-12-17 22:53:20.748521	2025-12-17 22:53:20.748521	2025-12-18 01:05:13.196477
e0b18249-2d1b-4e71-9100-fbf0e0f91a41	d45f6a86-d4c3-41f0-9046-a6dc973001eb	3	Mahasiswa mampu mempresentasikan ide dasar sumber daya air secara lisan/tertulis menggunakan bahasa Inggris profesional. (CPL 06)	2025-12-17 22:53:20.749262	2025-12-17 22:53:20.749262	2025-12-18 01:05:13.196477
a66eaeca-f98a-46a2-8f2b-ae48e0febece	d45f6a86-d4c3-41f0-9046-a6dc973001eb	4	Mahasiswa mampu membaca, menafsirkan, dan mengutip referensi sumber daya air berbahasa Inggris. (CPL 06)	2025-12-17 22:53:20.749891	2025-12-17 22:53:20.749891	2025-12-18 01:05:13.196477
674bff28-c81a-4aba-9926-3beeb67d3417	9cf0092c-4eee-4432-89a6-09da9fff56d3	1	Menjelaskan prinsip dasar pengukuran dan pemetaan topografi. (CPL 02)	2025-12-17 22:53:20.751257	2025-12-17 22:53:20.751257	2025-12-18 01:05:13.200954
b61afcea-4077-42cf-826b-9614ef74caf1	9cf0092c-4eee-4432-89a6-09da9fff56d3	2	Melakukan pengukuran jarak, sudut, dan elevasi menggunakan alat ukur manual dan digital. (CPL 05)	2025-12-17 22:53:20.75194	2025-12-17 22:53:20.75194	2025-12-18 01:05:13.200954
404b43f9-2922-421b-8dd4-01cb59346939	9cf0092c-4eee-4432-89a6-09da9fff56d3	3	Menggambar peta topografi dari data hasil pengukuran (CPL 05)	2025-12-17 22:53:20.752611	2025-12-17 22:53:20.752611	2025-12-18 01:05:13.200954
57f28aec-b797-41fb-a288-11d60d5279fe	9cf0092c-4eee-4432-89a6-09da9fff56d3	4	Mengolah data pengukuran dengan perangkat lunak sederhana. (CPL 05)	2025-12-17 22:53:20.753249	2025-12-17 22:53:20.753249	2025-12-18 01:05:13.200954
78caf93e-7698-4b63-b1d9-f51034f8dd82	9cf0092c-4eee-4432-89a6-09da9fff56d3	5	Menyusun laporan hasil pengukuran dan pemetaan topografi. (CPL 05)	2025-12-17 22:53:20.753868	2025-12-17 22:53:20.753868	2025-12-18 01:05:13.200954
70c1da62-964f-4f70-bce2-dc7622967ab0	8fe6d386-61fa-4b94-a75b-889cc559f711	1	menjelaskan konsep dasar sistem Bumi, termasuk geosfer , proses internal-eksternal Bumi, dan keterkaitannya dengan fenomena alam (CPL 01)	2025-12-17 22:53:20.755177	2025-12-17 22:53:20.755177	2025-12-18 01:05:13.206502
e61ea9b4-16b1-4ca2-967c-88928eab18ba	8fe6d386-61fa-4b94-a75b-889cc559f711	2	mengidentifikasi jenis batuan, mineral, tanah, serta struktur geologi berdasarkan karakteristik fisik dan proses pembentukannya, baik melalui pengamatan langsung maupun literatur (CPL 03)	2025-12-17 22:53:20.755818	2025-12-17 22:53:20.755818	2025-12-18 01:05:13.206502
3a9dce2a-ecd3-47e2-bdd4-7657edb10b3e	8fe6d386-61fa-4b94-a75b-889cc559f711	3	menganalisis proses geologi (vulkanisme, tektonik, pelapukan, erosi, sedimentasi) dan mendeksripsikan bentuklahan (geomorfologi) serta implikasinya terhadap lingkungan dan pembangunan (CPL 05)	2025-12-17 22:53:20.756486	2025-12-17 22:53:20.756486	2025-12-18 01:05:13.206502
9afeda15-c0c1-4fba-8588-4df518a44d0a	0343526c-69a1-4dcb-8006-4d2be1763604	1	Mahasiswa mampu menjelaskan prinsip-prinsip aqidah Islam secara benar sesuai Al-Qur’an, Sunnah, dan pandangan Muhammadiyah.	2025-12-17 22:53:20.759316	2025-12-17 22:53:20.759316	2025-12-18 01:05:13.211447
973d13a0-80b4-470d-bdf4-a9faf56c5802	0343526c-69a1-4dcb-8006-4d2be1763604	2	Mahasiswa mampu menganalisis penerapan akidah dalam pembentukan akhlak, karakter profesional, dan integritas diri di lingkungan akademik dan sosial.	2025-12-17 22:53:20.760001	2025-12-17 22:53:20.760001	2025-12-18 01:05:13.211447
6296b1d8-6729-445a-b73c-3b2a52bcc603	0343526c-69a1-4dcb-8006-4d2be1763604	3	Mahasiswa mampu menguraikan pemikiran, manhaj tarjih, dan peran Muhammadiyah dalam gerakan pembaruan Islam serta kontribusinya bagi pembangunan masyarakat.	2025-12-17 22:53:20.760625	2025-12-17 22:53:20.760625	2025-12-18 01:05:13.211447
3f9b13d0-fdb8-4c84-a918-9b2a3c2e764a	0343526c-69a1-4dcb-8006-4d2be1763604	4	Mahasiswa mampu menguraikan pemikiran, manhaj tarjih, dan peran Muhammadiyah dalam gerakan pembaruan Islam serta kontribusinya bagi pembangunan masyarakat.	2025-12-17 22:53:20.761241	2025-12-17 22:53:20.761241	2025-12-18 01:05:13.211447
6837c521-dd02-4ef4-bd30-fc94e7d03b76	655d2811-67ab-422c-a8ba-ea3ac5c932e8	1	Menjelaskan konsep kepemimpinan dan perannya dalam dunia teknik (CPL 07)	2025-12-17 22:53:20.763336	2025-12-17 22:53:20.763336	2025-12-18 01:05:13.216117
d9a081db-1d16-490d-acbb-0dc5a5bbcc33	655d2811-67ab-422c-a8ba-ea3ac5c932e8	2	Menganalisis keterampilan interpersonal dan komunikasi dalam tim kerja (CPL 04)	2025-12-17 22:53:20.764074	2025-12-17 22:53:20.764074	2025-12-18 01:05:13.216117
43379c28-a7b2-4383-8775-2f63e2f20f09	655d2811-67ab-422c-a8ba-ea3ac5c932e8	3	Menjelaskan prinsip dasar kewirausahaan dan inovasi (CPL07)	2025-12-17 22:53:20.764742	2025-12-17 22:53:20.764742	2025-12-18 01:05:13.216117
75e019ca-a83a-4f98-846b-04e8b743917d	a51d25c6-1313-4fda-adf7-85ac15e80cd1	1	Menjelaskan konsep dasar etika profesi dan peranannya dalam dunia teknik	2025-12-17 22:53:20.768047	2025-12-17 22:53:20.768047	2025-12-18 01:05:13.221136
19da7bb0-2df5-47db-b441-984b17a1e912	a51d25c6-1313-4fda-adf7-85ac15e80cd1	2	Menganalisis kode etik profesi teknik nasional dan internasional	2025-12-17 22:53:20.768847	2025-12-17 22:53:20.768847	2025-12-18 01:05:13.221136
5924763c-e1e3-420d-ba8e-78bada0dc08f	9aaf78bf-bdb2-4def-b106-01b309c22f39	1	Menjelaskan struktur dan komposisi bumi (CPL 06)	2025-12-17 22:53:20.772265	2025-12-17 22:53:20.772265	2025-12-18 01:05:13.227064
62ca7d07-aa80-4bc5-9e5c-40b215399ace	9aaf78bf-bdb2-4def-b106-01b309c22f39	2	Mengidentifikasi jenis-jenis batuan dan mineral (CPL 03)	2025-12-17 22:53:20.772956	2025-12-17 22:53:20.772956	2025-12-18 01:05:13.227064
4546c032-d5e3-40e1-9ab8-522007b58928	9aaf78bf-bdb2-4def-b106-01b309c22f39	3	Menjelaskan proses-proses geologi yang mempengaruhi permukaan bumi (CPL 06)	2025-12-17 22:53:20.773572	2025-12-17 22:53:20.773572	2025-12-18 01:05:13.227064
9af1547a-9fc0-410e-8ebe-ab900645e35f	9aaf78bf-bdb2-4def-b106-01b309c22f39	4	Menerapkan pengetahuan geologi dalam perencanaan infrastruktur SDA (CPL 06)	2025-12-17 22:53:20.774291	2025-12-17 22:53:20.774291	2025-12-18 01:05:13.227064
25604fe5-9e90-4ede-931a-6212951e98b6	9aaf78bf-bdb2-4def-b106-01b309c22f39	5	Menganalisis risiko geologi terhadap konstruksi teknik pengairan (CPL 03)	2025-12-17 22:53:20.775156	2025-12-17 22:53:20.775156	2025-12-18 01:05:13.227064
02fb1ee5-0272-4663-936c-0073bd85ecb1	745858f1-604b-4421-bd20-56ab8d02ced7	1	Mampu menyajikan data dalam bentuk tabel, grafik, dan diagram (CPL 01)	2025-12-17 22:53:20.776814	2025-12-17 22:53:20.776814	2025-12-18 01:05:13.232027
567a395c-1ce0-4723-b29d-8fa937fd1366	745858f1-604b-4421-bd20-56ab8d02ced7	2	Menghitung ukuran pemusatan (mean, median, modus) dan ukuran penyebaran (range, varians, simpangan baku) (CPL 01)	2025-12-17 22:53:20.777438	2025-12-17 22:53:20.777438	2025-12-18 01:05:13.232027
886eed39-713d-4c7c-8f8e-7180845ed551	745858f1-604b-4421-bd20-56ab8d02ced7	3	Menganalisis peluang kejadian menggunakan aturan peluang dasar (CPL 01)	2025-12-17 22:53:20.778157	2025-12-17 22:53:20.778157	2025-12-18 01:05:13.232027
6e145cb6-b0e3-4788-b470-3fb8309e551e	745858f1-604b-4421-bd20-56ab8d02ced7	4	Menentukan distribusi probabilitas diskrit (binomial, Poisson) dan kontinu (normal) (CPL 01)	2025-12-17 22:53:20.778847	2025-12-17 22:53:20.778847	2025-12-18 01:05:13.232027
16272885-dfcc-41cd-9497-9e1685c9d12f	83845056-e7ce-4495-b867-f8bd24a0b7fb	1	Menganalisis data hidrologi untuk perhitungan banjir rancangan (CPL 02)	2025-12-17 22:53:20.781006	2025-12-17 22:53:20.781006	2025-12-18 01:05:13.236697
17453a59-f88b-4e1f-a0d9-04d09b880d91	83845056-e7ce-4495-b867-f8bd24a0b7fb	2	Menggunakan analisis frekuensi statistik pada data hujan dan debit (CPL 02)	2025-12-17 22:53:20.781637	2025-12-17 22:53:20.781637	2025-12-18 01:05:13.236697
7a40e013-5101-4e9b-b2af-46b3854e0077	83845056-e7ce-4495-b867-f8bd24a0b7fb	3	Membangun model hidrograf satuan dari data hujan dan debit (CPL 02)	2025-12-17 22:53:20.782226	2025-12-17 22:53:20.782226	2025-12-18 01:05:13.236697
318968b6-5a86-4a66-8dde-f3aa02139ea8	83845056-e7ce-4495-b867-f8bd24a0b7fb	4	Mengaplikasikan perangkat lunak hidrologi dalam analisis curah hujan dan debit (CPL 03)	2025-12-17 22:53:20.782857	2025-12-17 22:53:20.782857	2025-12-18 01:05:13.236697
c2c07c0a-fe19-4f48-bf6b-300e941564a7	83845056-e7ce-4495-b867-f8bd24a0b7fb	5	Mengevaluasi hasil analisis hidrologi untuk pengambilan keputusan teknis (CPL 03)	2025-12-17 22:53:20.783458	2025-12-17 22:53:20.783458	2025-12-18 01:05:13.236697
88b61104-82a8-496c-9b05-b04c130098e9	58da71e5-9528-4f85-9649-976d128ba564	1	Menjelaskan parameter kualitas air dan standar baku mutu (CPL 02)	2025-12-17 22:53:20.784984	2025-12-17 22:53:20.784984	2025-12-18 01:05:13.241186
c73a03a1-5dd4-494d-af1f-e38127c2564f	58da71e5-9528-4f85-9649-976d128ba564	2	Menganalisis proses dasar pengolahan air bersih (CPL 02)	2025-12-17 22:53:20.785744	2025-12-17 22:53:20.785744	2025-12-18 01:05:13.241186
2a4c9157-6e1e-462d-b300-5881862754e5	58da71e5-9528-4f85-9649-976d128ba564	3	Merancang sistem jaringan perpipaan untuk distribusi air (CPL 02)	2025-12-17 22:53:20.786381	2025-12-17 22:53:20.786381	2025-12-18 01:05:13.241186
74653976-fe46-403c-b166-c49ed37c9fec	58da71e5-9528-4f85-9649-976d128ba564	4	Menerapkan prinsip hidrolika dalam sistem perpipaan bertekanan (CPL 05)	2025-12-17 22:53:20.787064	2025-12-17 22:53:20.787064	2025-12-18 01:05:13.241186
7ebc5e6b-881c-48a7-9ddd-d1490c791068	58da71e5-9528-4f85-9649-976d128ba564	5	Menyusun laporan dan presentasi sistem pengolahan dan jaringan distribusi (CPL 05)	2025-12-17 22:53:20.787769	2025-12-17 22:53:20.787769	2025-12-18 01:05:13.241186
f56bfeed-6dcc-4e90-94c1-ef358822656a	25b38d7a-5a8a-49a8-bc18-86328b038259	1	Menjelaskan konsep dasar keselamatan dan kesehatan kerja (K3) di proyek konstruksi (CPL 05)	2025-12-17 22:53:20.789244	2025-12-17 22:53:20.789244	2025-12-18 01:05:13.246476
84b79ef8-2d1c-45f9-91f4-47cbd08fbd09	25b38d7a-5a8a-49a8-bc18-86328b038259	2	Menganalisis standar dan regulasi K3 nasional dan internasional (CPL 05)	2025-12-17 22:53:20.789868	2025-12-17 22:53:20.789868	2025-12-18 01:05:13.246476
d03cb77f-afd2-4bc6-9581-60c3548772c0	25b38d7a-5a8a-49a8-bc18-86328b038259	3	Merancang sistem manajemen K3 untuk proyek konstruksi (CPL 09)	2025-12-17 22:53:20.790609	2025-12-17 22:53:20.790609	2025-12-18 01:05:13.246476
e5555857-3c80-4420-8bce-64758dbfaced	25b38d7a-5a8a-49a8-bc18-86328b038259	4	Mengevaluasi penerapan K3 di lapangan melalui studi kasus (CPL 09)	2025-12-17 22:53:20.791267	2025-12-17 22:53:20.791267	2025-12-18 01:05:13.246476
ac83122c-f14e-47db-b18a-c96528b72dce	4b04323e-5a49-431f-8f5d-889b416fea4c	1	Mahasiswa mampu menjelaskan prinsip-prinsip fiqh ibadah dan muamalah dalam Islam berdasarkan Al-Qur’an, Sunnah, dan Manhaj Tarjih Muhammadiyah.	2025-12-17 22:53:20.793192	2025-12-17 22:53:20.793192	2025-12-18 01:05:13.251287
2e47f655-4e43-47c7-9784-a299424285f2	4b04323e-5a49-431f-8f5d-889b416fea4c	2	Mahasiswa mampu menganalisis isu-isu ibadah dan muamalah kontemporer (ekonomi, sosial, digital) menggunakan pendekatan tarjih yang rasional dan berbasis dalil.	2025-12-17 22:53:20.7938	2025-12-17 22:53:20.7938	2025-12-18 01:05:13.251287
97537010-3fa5-4520-b530-1c39db71b0d1	4b04323e-5a49-431f-8f5d-889b416fea4c	3	Mahasiswa mampu mengevaluasi penerapan nilai ibadah, akhlak, dan muamalah Islami dalam kehidupan pribadi, sosial, dan lingkungan akademik.	2025-12-17 22:53:20.794414	2025-12-17 22:53:20.794414	2025-12-18 01:05:13.251287
df04eee7-f375-4b9c-b742-752f80f3bfbb	d8d56fdd-d996-40e4-bec0-f1de0e98f7f1	1	menjelaskan konsep dasar metode numerik, termasuk galat (error), stabilitas, konvergensi, dan pendekatan numerik terhadap permasalahan matematika teknik (CPL 01)	2025-12-17 22:53:20.796756	2025-12-17 22:53:20.796756	2025-12-18 01:05:13.255212
4ea37770-e346-45d6-9e71-01847d47fb3a	d8d56fdd-d996-40e4-bec0-f1de0e98f7f1	2	menerapkan metode numerik untuk menyelesaikan persamaan nonlinear (bisection, Newton–Raphson) dan sistem persamaan linear (eliminasi Gauss, Gauss–Seidel, Jacobi) serta menganalisis ketepatannya. (CPL 01)	2025-12-17 22:53:20.797454	2025-12-17 22:53:20.797454	2025-12-18 01:05:13.255212
277763ff-6b01-479f-8d45-2648bc2701c1	d8d56fdd-d996-40e4-bec0-f1de0e98f7f1	3	menggunakan metode interpolasi (Newton, Lagrange), regresi, dan pendekatan kurva untuk memodelkan data teknik serta mengevaluasi hasil pemodelan (CPL 04)	2025-12-17 22:53:20.798071	2025-12-17 22:53:20.798071	2025-12-18 01:05:13.255212
cc37dfbe-3b43-4e8c-900e-9434b7367abb	d8d56fdd-d996-40e4-bec0-f1de0e98f7f1	4	menghitung turunan dan integral secara numerik menggunakan metode finite difference, aturan trapezoid, Simpson, serta menerapkan metode ini dalam kasus teknik. (CPL 04)	2025-12-17 22:53:20.798687	2025-12-17 22:53:20.798687	2025-12-18 01:05:13.255212
3d618f80-effe-4951-a6c5-cad751544440	4183f953-eef6-4b87-aee6-45e11688bf5b	1	Menjelaskan konsep kapasitas dukung tanah untuk pondasi dangkal dan dalam. (CPL 01)	2025-12-17 22:53:20.800792	2025-12-17 22:53:20.800792	2025-12-18 01:05:13.260291
572eeb9f-d9de-4863-a356-213522569121	4183f953-eef6-4b87-aee6-45e11688bf5b	2	Menganalisis kestabilan lereng alam dan buatan (CPL 05)	2025-12-17 22:53:20.801514	2025-12-17 22:53:20.801514	2025-12-18 01:05:13.260291
af1723e8-3a21-49a4-b7b7-e66b77e9566a	4183f953-eef6-4b87-aee6-45e11688bf5b	3	Menghitung tekanan tanah lateral untuk desain dinding penahan tanah (CPL 05)	2025-12-17 22:53:20.802197	2025-12-17 22:53:20.802197	2025-12-18 01:05:13.260291
c24e489a-b110-4f03-a938-54ecedcc49e6	4183f953-eef6-4b87-aee6-45e11688bf5b	4	Merancang sistem pondasi sesuai kondisi tanah dan beban struktur (CPL 03)	2025-12-17 22:53:20.802852	2025-12-17 22:53:20.802852	2025-12-18 01:05:13.260291
7f6b5f9e-24ad-4e4a-88a6-35cf67e02053	4183f953-eef6-4b87-aee6-45e11688bf5b	5	Menyusun laporan teknis hasil analisis dan desain geoteknik (CPL 03)	2025-12-17 22:53:20.803489	2025-12-17 22:53:20.803489	2025-12-18 01:05:13.260291
3671f862-2f42-40ab-8fbe-4e2e2778c4c8	09b7406a-1a3f-4a71-a494-084a08f7e657	1	Menjelaskan prinsip dasar teknik lingkungan dan konsep pembangunan berkelanjutan (CPL 05)	2025-12-17 22:53:20.809125	2025-12-17 22:53:20.809125	2025-12-18 01:05:13.270878
11fc638c-c2d1-4431-b73f-6fb6d33bb058	09b7406a-1a3f-4a71-a494-084a08f7e657	2	Menganalisis jenis dan sumber pencemaran air, udara, dan tanah (CPL 05)	2025-12-17 22:53:20.809787	2025-12-17 22:53:20.809787	2025-12-18 01:05:13.270878
660a0e5a-b88d-4acf-a9a6-ba56eb21dd38	09b7406a-1a3f-4a71-a494-084a08f7e657	3	Mengenali prosedur dan komponen penyusunan dokumen AMDAL (CPL 05)	2025-12-17 22:53:20.810336	2025-12-17 22:53:20.810336	2025-12-18 01:05:13.270878
09765b99-b47f-4d9c-a483-7711fe9cbe5e	09b7406a-1a3f-4a71-a494-084a08f7e657	4	Menyusun kajian dampak lingkungan awal dari suatu proyek SDA (CPL 09)	2025-12-17 22:53:20.810994	2025-12-17 22:53:20.810994	2025-12-18 01:05:13.270878
1886ab3f-a760-4016-9c75-fbed81c408b1	09b7406a-1a3f-4a71-a494-084a08f7e657	5	Mempresentasikan hasil kajian AMDAL dan berdiskusi secara kritis (CPL 09)	2025-12-17 22:53:20.811777	2025-12-17 22:53:20.811777	2025-12-18 01:05:13.270878
84f4c0a8-e5be-404e-b159-558ff149b6ca	129e4398-9121-40a5-bd3c-8781a8da8cb9	1	Menjelaskan struktur atom, tabel periodik, dan ikatan kimia (CPL 01)	2025-12-17 22:53:20.814625	2025-12-17 22:53:20.814625	2025-12-18 01:05:13.275606
3a6aedab-3fc2-4b81-af65-4aebdb408c85	129e4398-9121-40a5-bd3c-8781a8da8cb9	2	Menghitung stoikiometri reaksi kimia (CPL 01)	2025-12-17 22:53:20.8155	2025-12-17 22:53:20.8155	2025-12-18 01:05:13.275606
e4d4b549-4c8f-411b-87d9-cc0373854eb1	129e4398-9121-40a5-bd3c-8781a8da8cb9	3	Menjelaskan sifat-sifat larutan dan konsentrasinya (CPL 01)	2025-12-17 22:53:20.816241	2025-12-17 22:53:20.816241	2025-12-18 01:05:13.275606
74af7016-d6fc-4e80-ba8a-22ef19f23b90	129e4398-9121-40a5-bd3c-8781a8da8cb9	4	Menganalisis reaksi kimia yang terjadi di lingkungan perairan (CPL 05)	2025-12-17 22:53:20.816941	2025-12-17 22:53:20.816941	2025-12-18 01:05:13.275606
3d9a5599-8926-4bcf-a032-f2ff90382f22	129e4398-9121-40a5-bd3c-8781a8da8cb9	5	Menerapkan konsep kimia dalam pengelolaan kualitas air (CPL 05)	2025-12-17 22:53:20.817577	2025-12-17 22:53:20.817577	2025-12-18 01:05:13.275606
bd8a6af3-a07e-4493-8b78-58546aea4268	42d307cb-2d3e-49ca-a8a3-de20dd7db04a	1	Menggunakan Microsoft Excel untuk pengolahan dan analisis data hidrologi. (CPL 01)	2025-12-17 22:53:20.819039	2025-12-17 22:53:20.819039	2025-12-18 01:05:13.281482
97f638eb-c595-45cc-b1a5-8ef040bb9595	42d307cb-2d3e-49ca-a8a3-de20dd7db04a	2	Mengoperasikan AutoCAD untuk menggambar rancangan teknik sederhana. (CPL 01)	2025-12-17 22:53:20.819909	2025-12-17 22:53:20.819909	2025-12-18 01:05:13.281482
6ca6adda-89c6-477a-8393-ba2d9f929c09	42d307cb-2d3e-49ca-a8a3-de20dd7db04a	3	Menerapkan QGIS untuk pengolahan data spasial dan pemetaan. (CPL 05)	2025-12-17 22:53:20.820766	2025-12-17 22:53:20.820766	2025-12-18 01:05:13.281482
599f7631-5cec-423b-8591-7510bc5eed55	42d307cb-2d3e-49ca-a8a3-de20dd7db04a	4	Menggunakan HEC-RAS untuk simulasi aliran sungai satu dimensi. (CPL 05)	2025-12-17 22:53:20.821642	2025-12-17 22:53:20.821642	2025-12-18 01:05:13.281482
cb160cf0-458a-4374-ba1f-3066316f3011	4a7b4832-3288-4de6-81b4-059c176a97b4	1	Menjelaskan sifat fisik dan kimia tanah serta pengaruhnya terhadap pertumbuhan tanaman (CPL 01)	2025-12-17 22:53:20.824744	2025-12-17 22:53:20.824744	2025-12-18 01:05:13.285864
e28c43e1-cf6e-4bc6-aef2-b6428ae9d9ff	4a7b4832-3288-4de6-81b4-059c176a97b4	2	Menganalisis kebutuhan air tanaman berdasarkan jenis tanaman dan fase pertumbuhannya (CPL 05)	2025-12-17 22:53:20.825542	2025-12-17 22:53:20.825542	2025-12-18 01:05:13.285864
3f2bec3e-10c7-465b-9e6d-91162d156aef	4a7b4832-3288-4de6-81b4-059c176a97b4	3	Menjelaskan interaksi antara tanah, air, dan tanaman dalam sistem pertanian (CPL 01)	2025-12-17 22:53:20.82623	2025-12-17 22:53:20.82623	2025-12-18 01:05:13.285864
b6a160cd-b5a3-4568-8048-855ebe176f8d	4a7b4832-3288-4de6-81b4-059c176a97b4	4	Mengidentifikasi teknik konservasi tanah dan air dalam pengelolaan lahan (CPL 03)	2025-12-17 22:53:20.826919	2025-12-17 22:53:20.826919	2025-12-18 01:05:13.285864
00f2a29c-20e8-40dd-bf20-1af3b079a14b	a8bac38d-1b0b-4c86-afc0-efaf64845e3e	1	Menjelaskan sifat mekanik beton dan baja tulangan (CPL 02)	2025-12-17 22:53:20.829552	2025-12-17 22:53:20.829552	2025-12-18 01:05:13.290468
dfe0a96f-3f78-4d65-b77d-55f5311629d6	a8bac38d-1b0b-4c86-afc0-efaf64845e3e	2	Menerapkan konsep tegangan-leleh dan beban izin dalam beton bertulang (CPL 05)	2025-12-17 22:53:20.830463	2025-12-17 22:53:20.830463	2025-12-18 01:05:13.290468
3fe213c0-497a-4519-8819-23ddb3bd7a16	a8bac38d-1b0b-4c86-afc0-efaf64845e3e	3	Menganalisis kekuatan lentur dan geser pada balok beton bertulang (CPL 05)	2025-12-17 22:53:20.831481	2025-12-17 22:53:20.831481	2025-12-18 01:05:13.290468
1f319bf7-eabb-4284-8663-9eadf65a535d	a8bac38d-1b0b-4c86-afc0-efaf64845e3e	4	Merancang balok beton satu bentang dengan beban merata (CPL 02)	2025-12-17 22:53:20.832311	2025-12-17 22:53:20.832311	2025-12-18 01:05:13.290468
fedea72b-609a-48a3-a51a-20740efd8611	a8bac38d-1b0b-4c86-afc0-efaf64845e3e	5	Menyusun laporan desain dan perhitungan struktur beton sederhana (CPL 02)	2025-12-17 22:53:20.832949	2025-12-17 22:53:20.832949	2025-12-18 01:05:13.290468
6674c541-82dc-4292-97fb-6433dc4a9fce	6d8fec6f-3844-452a-b2ce-113879e4ab18	1	Menjelaskan jenis dan karakteristik material serta profil struktur baja (CPL 02)	2025-12-17 22:53:20.834443	2025-12-17 22:53:20.834443	2025-12-18 01:05:13.295124
e887ef7b-7a4f-42e9-89fc-1a290cd5f773	6d8fec6f-3844-452a-b2ce-113879e4ab18	2	Menganalisis beban, gaya dalam, dan respons struktur baja sederhana (CPL 05)	2025-12-17 22:53:20.835215	2025-12-17 22:53:20.835215	2025-12-18 01:05:13.295124
43f28721-1f9d-4ae7-a56a-922d255acf40	6d8fec6f-3844-452a-b2ce-113879e4ab18	3	Merancang elemen struktur baja seperti balok, kolom, dan sambungan (CPL 05)	2025-12-17 22:53:20.836054	2025-12-17 22:53:20.836054	2025-12-18 01:05:13.295124
bff0114a-68b3-4d61-a879-20e4647f17ac	6d8fec6f-3844-452a-b2ce-113879e4ab18	4	Mengevaluasi efisiensi dan keamanan desain struktur baja (CPL 05)	2025-12-17 22:53:20.837164	2025-12-17 22:53:20.837164	2025-12-18 01:05:13.295124
e5ce5ac5-1ccc-4d9e-98c2-96a49dae0264	6d8fec6f-3844-452a-b2ce-113879e4ab18	5	Mempresentasikan hasil desain struktur baja secara profesional (CPL 02)	2025-12-17 22:53:20.838039	2025-12-17 22:53:20.838039	2025-12-18 01:05:13.295124
8c51d1d5-ce7f-4b12-9acb-0329dea5c448	7d9fd057-47d3-4ced-a74e-78ba889e6092	1	Menjelaskan tipe-tipe bendungan berdasarkan material dan fungsi (CPL 02)	2025-12-17 22:53:20.83973	2025-12-17 22:53:20.83973	2025-12-18 01:05:13.299594
8cfb6798-0155-49c2-be86-51673220cdcc	7d9fd057-47d3-4ced-a74e-78ba889e6092	2	Menganalisis tahapan konstruksi bendungan tipe urugan (CPL 02)	2025-12-17 22:53:20.84052	2025-12-17 22:53:20.84052	2025-12-18 01:05:13.299594
e57c4353-28e4-4e92-a7cb-5164b5c7a3a9	7d9fd057-47d3-4ced-a74e-78ba889e6092	3	Menerapkan spesifikasi teknis dan peraturan dalam konstruksi bendungan (CPL 05)	2025-12-17 22:53:20.841237	2025-12-17 22:53:20.841237	2025-12-18 01:05:13.299594
ed64bcb1-102d-4e43-820c-62a34299bb57	7d9fd057-47d3-4ced-a74e-78ba889e6092	4	Merancang urutan pekerjaan konstruksi berdasarkan data teknis (CPL 02)	2025-12-17 22:53:20.841908	2025-12-17 22:53:20.841908	2025-12-18 01:05:13.299594
ec1b5a40-25e3-4a7e-9d13-9f69d2aee815	7d9fd057-47d3-4ced-a74e-78ba889e6092	5	Menjelaskan aspek keselamatan konstruksi pada pembangunan bendungan (CPL 09)	2025-12-17 22:53:20.842541	2025-12-17 22:53:20.842541	2025-12-18 01:05:13.299594
636a7773-8dce-4221-8572-723bb7664658	70fa1753-6c94-433b-8199-187402d9fecb	1	Menjelaskan jenis dan fungsi alat berat yang digunakan dalam pemindahan tanah (CPL 02)	2025-12-17 22:53:20.844018	2025-12-17 22:53:20.844018	2025-12-18 01:05:13.303963
b922a590-d2bf-4099-b24c-de3972365c3e	70fa1753-6c94-433b-8199-187402d9fecb	2	Menghitung produktivitas alat berat berdasarkan kondisi operasional di lapangan (CPL 05)	2025-12-17 22:53:20.844816	2025-12-17 22:53:20.844816	2025-12-18 01:05:13.303963
164293ee-8a9d-40cc-b7fa-1676b1f7ee77	70fa1753-6c94-433b-8199-187402d9fecb	3	Merancang perencanaan pekerjaan pemindahan tanah mekanis (CPL 02)	2025-12-17 22:53:20.845922	2025-12-17 22:53:20.845922	2025-12-18 01:05:13.303963
b3469df5-976d-49f0-9394-aaa35a0790c3	70fa1753-6c94-433b-8199-187402d9fecb	4	Menganalisis biaya operasional dan efisiensi alat berat (CPL 05)	2025-12-17 22:53:20.846733	2025-12-17 22:53:20.846733	2025-12-18 01:05:13.303963
7786f86b-b773-4d78-9e69-69cdf28309cf	bee8f2a5-1a84-4395-8ccc-ba6d71a0db92	1	Menjelaskan konsep dasar manajemen air terpadu (IWRM) (CPL 07)	2025-12-17 22:53:20.84933	2025-12-17 22:53:20.84933	2025-12-18 01:05:13.308277
5c498853-cf05-4e50-8a0b-5298f3532bb5	bee8f2a5-1a84-4395-8ccc-ba6d71a0db92	2	Menganalisis tantangan dan strategi pengelolaan air di berbagai sektor (CPL 07)	2025-12-17 22:53:20.850157	2025-12-17 22:53:20.850157	2025-12-18 01:05:13.308277
4b281bad-eb5e-4bd0-ba43-21ec5e6de56b	bee8f2a5-1a84-4395-8ccc-ba6d71a0db92	3	Menerapkan konsep konservasi dan efisiensi penggunaan air (CPL 07)	2025-12-17 22:53:20.850935	2025-12-17 22:53:20.850935	2025-12-18 01:05:13.308277
a4368756-ff15-43a5-ae3c-93e89f2c6c06	bee8f2a5-1a84-4395-8ccc-ba6d71a0db92	4	Merancang sistem manajemen air berbasis DAS dan keterlibatan pemangku kepentingan (CPL 07)	2025-12-17 22:53:20.851782	2025-12-17 22:53:20.851782	2025-12-18 01:05:13.308277
ee37ff11-c196-4ba9-a2f8-f065094dea4e	bee8f2a5-1a84-4395-8ccc-ba6d71a0db92	5	Menyusun laporan dan mempresentasikan kebijakan dan strategi manajemen air (CPL 08)	2025-12-17 22:53:20.852683	2025-12-17 22:53:20.852683	2025-12-18 01:05:13.308277
570d2b2d-5f04-4577-8a5e-87cfb3b53aed	70f548a5-90e4-4563-b409-9a7ec2440e54	1	Menjelaskan prinsip dasar pengembangan sumber daya air terpadu (CPL 02)	2025-12-17 22:53:20.854464	2025-12-17 22:53:20.854464	2025-12-18 01:05:13.313515
97dc935d-b81f-443c-9485-f9ab8f929bd1	70f548a5-90e4-4563-b409-9a7ec2440e54	2	Menganalisis potensi dan kebutuhan air pada suatu wilayah DAS. (CPL 02)	2025-12-17 22:53:20.855255	2025-12-17 22:53:20.855255	2025-12-18 01:05:13.313515
a4ab0285-ff33-4043-9b9d-5cfcdf006721	70f548a5-90e4-4563-b409-9a7ec2440e54	3	Menerapkan konsep konservasi, pengendalian, dan pemanfaatan SDA. (CPL 02)	2025-12-17 22:53:20.856026	2025-12-17 22:53:20.856026	2025-12-18 01:05:13.313515
1d239a93-5222-440e-8705-be5406ae105e	70f548a5-90e4-4563-b409-9a7ec2440e54	4	Merancang kerangka pengembangan SDA untuk multi sektor dan multipurpose. (CPL 02)	2025-12-17 22:53:20.856764	2025-12-17 22:53:20.856764	2025-12-18 01:05:13.313515
28ea1d55-c43c-4dcb-91e5-b30818e31615	70f548a5-90e4-4563-b409-9a7ec2440e54	5	Menyusun laporan pengembangan dan kebijakan pengelolaan SDA. (CPL 08)	2025-12-17 22:53:20.857538	2025-12-17 22:53:20.857538	2025-12-18 01:05:13.313515
1368cb6c-a8a3-4edd-b20b-818c9b5aa7c8	163ed239-5d48-46d7-8113-040dfc65cfdb	1	Menjelaskan konsep dan komponen sistem drainase perkotaan. (CPL 02)	2025-12-17 22:53:20.859176	2025-12-17 22:53:20.859176	2025-12-18 01:05:13.317984
af883581-ea9f-4d77-af5e-9253ea67bee3	163ed239-5d48-46d7-8113-040dfc65cfdb	2	Menghitung debit limpasan permukaan menggunakan metode rasional dan hidrograf satuan. (CPL 05)	2025-12-17 22:53:20.859999	2025-12-17 22:53:20.859999	2025-12-18 01:05:13.317984
44a94704-6f6a-4b92-ad50-334d12dcc8c4	163ed239-5d48-46d7-8113-040dfc65cfdb	3	Menganalisis kapasitas saluran dan kebutuhan struktur pengendali. (CPL 05)	2025-12-17 22:53:20.860682	2025-12-17 22:53:20.860682	2025-12-18 01:05:13.317984
0fd8416b-9903-4189-8fec-298de297fc57	163ed239-5d48-46d7-8113-040dfc65cfdb	4	Merancang sistem drainase perkotaan berbasis peta tata guna lahan. (CPL 02)	2025-12-17 22:53:20.861354	2025-12-17 22:53:20.861354	2025-12-18 01:05:13.317984
3fe7df33-0359-4611-bb9b-c3cbc0f64938	a6a068f7-84af-406c-936e-35e01daba2fa	1	Menjelaskan proses fisik di wilayah pantai (gelombang, arus, sedimentasi). (CPL 04)	2025-12-17 22:53:20.8639	2025-12-17 22:53:20.8639	2025-12-18 01:05:13.321938
10e60369-2e02-4fa1-8e1d-bc2d38274ba4	a6a068f7-84af-406c-936e-35e01daba2fa	2	Menganalisis transport sedimen dan perubahan garis pantai. (CPL 04)	2025-12-17 22:53:20.864808	2025-12-17 22:53:20.864808	2025-12-18 01:05:13.321938
20d7c6b9-fc76-4db3-8a8b-314a06715447	a6a068f7-84af-406c-936e-35e01daba2fa	3	Menerapkan konsep desain struktur pantai seperti groin, breakwater, dan revetment. (CPL 05)	2025-12-17 22:53:20.865611	2025-12-17 22:53:20.865611	2025-12-18 01:05:13.321938
1c0402b1-797f-4979-84e7-5c168ede0ebe	a6a068f7-84af-406c-936e-35e01daba2fa	4	Merancang sistem perlindungan pantai untuk kasus tertentu. (CPL 05)	2025-12-17 22:53:20.866342	2025-12-17 22:53:20.866342	2025-12-18 01:05:13.321938
29d4f183-4f78-4d3f-873d-b9741f0c0e98	a6a068f7-84af-406c-936e-35e01daba2fa	5	Menyusun laporan teknis dan evaluasi dampak lingkungan dari intervensi pantai. (CPL 05)	2025-12-17 22:53:20.867108	2025-12-17 22:53:20.867108	2025-12-18 01:05:13.321938
88ec3b3c-efe5-481b-a47d-635a2a48bb9d	602674dd-a9fb-4c20-815d-567bfd023871	1	Menjelaskan prinsip kerja struktur beton bertulang untuk elemen kolom, pelat, dan tangga. (CPL 02)	2025-12-17 22:53:20.869195	2025-12-17 22:53:20.869195	2025-12-18 01:05:13.328182
5b8103c1-5ddb-4586-99b9-1b9acead02db	602674dd-a9fb-4c20-815d-567bfd023871	2	Menganalisis kapasitas struktur kolom, pelat dua arah, dan tangga beton bertulang. (CPL 02)	2025-12-17 22:53:20.870075	2025-12-17 22:53:20.870075	2025-12-18 01:05:13.328182
8e495d0d-de75-43cb-bb8f-70edc3a6fef7	602674dd-a9fb-4c20-815d-567bfd023871	3	Menerapkan konsep detailing penulangan pada struktur bertingkat. (CPL 05)	2025-12-17 22:53:20.8708	2025-12-17 22:53:20.8708	2025-12-18 01:05:13.328182
724fc06e-bb20-471f-ac64-a4b1b14c5583	602674dd-a9fb-4c20-815d-567bfd023871	4	Merancang sistem struktur beton bertulang untuk bangunan sederhana tahan gempa. (CPL 02)	2025-12-17 22:53:20.871525	2025-12-17 22:53:20.871525	2025-12-18 01:05:13.328182
aaa1b210-bf0d-40b9-96cf-e16701dd2aa4	602674dd-a9fb-4c20-815d-567bfd023871	5	Menyusun laporan desain dan presentasi struktur beton kompleks. (CPL 02)	2025-12-17 22:53:20.872167	2025-12-17 22:53:20.872167	2025-12-18 01:05:13.328182
f3884eae-6026-4bf2-bcd5-626b13ba9e79	2b2f7f62-3ce5-4a71-8dbd-504630479cdd	1	Menjelaskan morfologi dan hidraulika sungai. (CPL 02)	2025-12-17 22:53:20.873698	2025-12-17 22:53:20.873698	2025-12-18 01:05:13.332632
078539cc-b6d2-40d7-bc35-17e44fb31c16	2b2f7f62-3ce5-4a71-8dbd-504630479cdd	2	Menganalisis debit banjir dan penelusuran banjir menggunakan data historis. (CPL 05)	2025-12-17 22:53:20.874456	2025-12-17 22:53:20.874456	2025-12-18 01:05:13.332632
5ba37395-2979-4083-87b2-c05d6f8dbd6f	2b2f7f62-3ce5-4a71-8dbd-504630479cdd	3	Menerapkan metode perbaikan alur sungai dan pengendalian banjir. (CPL 05)	2025-12-17 22:53:20.875156	2025-12-17 22:53:20.875156	2025-12-18 01:05:13.332632
9e7426f5-49df-45fa-8836-fa0b1f07834c	2b2f7f62-3ce5-4a71-8dbd-504630479cdd	4	Merancang skema pengendalian banjir dan stabilisasi alur sungai. (CPL 02)	2025-12-17 22:53:20.875815	2025-12-17 22:53:20.875815	2025-12-18 01:05:13.332632
ad50c908-2548-4dcc-9318-0316f1856fc8	c92279ab-a524-4d4b-80fc-307220441dd8	1	Menjelaskan jenis dan fungsi pondasi pada bangunan air. (CPL 05)	2025-12-17 22:53:20.878314	2025-12-17 22:53:20.878314	2025-12-18 01:05:13.337037
081887f5-56ca-4277-b11f-fdf8176de6f3	c92279ab-a524-4d4b-80fc-307220441dd8	2	Menganalisis daya dukung pondasi dangkal dan dalam. (CPL 05)	2025-12-17 22:53:20.879184	2025-12-17 22:53:20.879184	2025-12-18 01:05:13.337037
202d0524-47e2-4978-b092-e0227b7ae488	c92279ab-a524-4d4b-80fc-307220441dd8	3	Merancang sistem pondasi berdasarkan kondisi geoteknik. (CPL 03)	2025-12-17 22:53:20.879973	2025-12-17 22:53:20.879973	2025-12-18 01:05:13.337037
a5096860-fe35-46f6-9cda-a1bd19e0a700	c92279ab-a524-4d4b-80fc-307220441dd8	4	Mengidentifikasi potensi keruntuhan pondasi dari studi kasus. (CPL 03)	2025-12-17 22:53:20.880825	2025-12-17 22:53:20.880825	2025-12-18 01:05:13.337037
c8d2f010-8eea-4c5e-ae87-54e61424b124	c92279ab-a524-4d4b-80fc-307220441dd8	5	Menyusun laporan teknis evaluasi dan perencanaan pondasi. (CPL 03)	2025-12-17 22:53:20.881498	2025-12-17 22:53:20.881498	2025-12-18 01:05:13.337037
7f1630ee-6157-47e4-9d24-7bbaf8d1a2dc	76024a5f-2cb1-4b07-b7c5-7a2062915ca9	1	Menjelaskan prinsip dan ruang lingkup manajemen proyek konstruksi. (CPL 07)	2025-12-17 22:53:20.883011	2025-12-17 22:53:20.883011	2025-12-18 01:05:13.342198
1cfd7264-6404-461d-b3f9-dcc07b3babdc	76024a5f-2cb1-4b07-b7c5-7a2062915ca9	2	Menyusun jadwal proyek menggunakan metode CPM/PERT. (CPL 07)	2025-12-17 22:53:20.883832	2025-12-17 22:53:20.883832	2025-12-18 01:05:13.342198
33e2db27-19f9-496b-89de-27cb03164f0e	76024a5f-2cb1-4b07-b7c5-7a2062915ca9	3	Menghitung estimasi biaya proyek dan mengatur anggaran konstruksi. (CPL 07)	2025-12-17 22:53:20.884632	2025-12-17 22:53:20.884632	2025-12-18 01:05:13.342198
ce4873d0-fe5d-48d6-8869-3bdba5b5f0cb	76024a5f-2cb1-4b07-b7c5-7a2062915ca9	4	Mengidentifikasi risiko dan strategi pengendalian proyek. (CPL 07)	2025-12-17 22:53:20.88547	2025-12-17 22:53:20.88547	2025-12-18 01:05:13.342198
01bf1c15-b4c4-4a22-90d9-bbaa5f8352d1	76024a5f-2cb1-4b07-b7c5-7a2062915ca9	5	Menyusun laporan dan mempresentasikan hasil perencanaan proyek. (CPL 08)	2025-12-17 22:53:20.886209	2025-12-17 22:53:20.886209	2025-12-18 01:05:13.342198
fadc76d1-ff0a-4d53-8928-d983ca1c4b55	17d5cde3-c3b3-4198-b57e-cb1a691add7b	1	Menjelaskan konsep dasar dan jenis-jenis pendekatan penelitian. (CPL 06)	2025-12-17 22:53:20.88778	2025-12-17 22:53:20.88778	2025-12-18 01:05:13.348215
f3c5c1ca-c805-43d5-b7a8-ed096fbc2e60	17d5cde3-c3b3-4198-b57e-cb1a691add7b	2	Merumuskan masalah dan tujuan penelitian yang relevan dengan teknik sumber daya air. (CPL 06)	2025-12-17 22:53:20.888525	2025-12-17 22:53:20.888525	2025-12-18 01:05:13.348215
607a06a0-30b1-4e66-99ea-b2b931d6e1f3	17d5cde3-c3b3-4198-b57e-cb1a691add7b	3	Melakukan kajian literatur dan menyusun landasan teori. (CPL 06)	2025-12-17 22:53:20.889192	2025-12-17 22:53:20.889192	2025-12-18 01:05:13.348215
a037c82a-5a78-4740-9c18-a793e1964953	17d5cde3-c3b3-4198-b57e-cb1a691add7b	4	Merancang metode penelitian dan teknik pengumpulan data. (CPL 03)	2025-12-17 22:53:20.889866	2025-12-17 22:53:20.889866	2025-12-18 01:05:13.348215
2859f4d6-fba4-4a85-bc8f-bc0a36158811	2427f215-ba4c-404b-8dca-09c45f61eb06	1	menjelaskan dan menganalisis sifat-sifat mekanis tanah lanjutan, termasuk kuat geser tanah, pemadatan, konsolidasi, serta perilaku tegangan–regangan tanah dalam berbagai kondisi pembebanan. (CPL 05)	2025-12-17 22:53:20.892242	2025-12-17 22:53:20.892242	2025-12-18 01:05:13.352722
c426326e-e3a8-4366-bf49-acf227d95646	2427f215-ba4c-404b-8dca-09c45f61eb06	2	menganalisis stabilitas lereng menggunakan metode keseimbangan batas (Fellenius, Bishop, Janbu) dan menentukan faktor keamanan pada berbagai kondisi geometri, jenis tanah, dan muka air tanah (CPL 03)	2025-12-17 22:53:20.892981	2025-12-17 22:53:20.892981	2025-12-18 01:05:13.352722
50dd1c6b-d4bc-4a55-b273-5073bf8463e7	2427f215-ba4c-404b-8dca-09c45f61eb06	3	menghitung tekanan tanah aktif, pasif, dan keadaan diam menggunakan teori Rankine/Coulomb serta merancang dinding penahan tanah berdasarkan analisis stabilitas dan deformasi (CPL 03)	2025-12-17 22:53:20.893695	2025-12-17 22:53:20.893695	2025-12-18 01:05:13.352722
5a95d1e9-167f-412a-9625-65102ddcda5d	a128a351-b08f-4d99-9a34-5bf9133b4e8f	3	Menganalisis kehilangan energi dalam aliran fluida nyata. (CPL 05)	2025-12-18 01:05:13.188961	2025-12-18 01:05:13.188961	\N
42070e23-9c7a-41e2-86ab-8860032fafb5	a128a351-b08f-4d99-9a34-5bf9133b4e8f	4	Menghitung debit aliran pada saluran terbuka dan pipa bertekanan. (CPL 02)	2025-12-18 01:05:13.189722	2025-12-18 01:05:13.189722	\N
d7359ba7-8ad9-4c66-9f43-00343fcb1e28	a128a351-b08f-4d99-9a34-5bf9133b4e8f	5	Menyusun laporan teknis analisis hidrolika dasar (CPL 02)	2025-12-18 01:05:13.190453	2025-12-18 01:05:13.190453	\N
e431bdaf-e8b0-456a-ae14-2dc2f08d85ff	a19f7c46-6f8f-44b2-82d6-374ce3af07b5	4	Mahasiswa mampu menerapkan perspektif kebangsaan dan nilai konstitusional dalam menilai dampak keputusan profesional di bidang sumber daya air dan masyarakat.	2025-12-17 22:53:20.746455	2025-12-17 22:53:20.746455	2025-12-18 01:05:13.191211
02f6ccb6-2702-4039-aeac-6ab0bf4705db	b6007f8f-a863-407d-94f2-76e1c0a2581f	1	Menganalisis sistem instrumentasi dan pemantauan bendungan.	2025-12-17 22:53:20.897117	2025-12-17 22:53:20.897117	2025-12-18 01:05:13.357303
3dd441bc-064a-4091-9ffe-a663d51f3063	b6007f8f-a863-407d-94f2-76e1c0a2581f	2	Menerapkan metode evaluasi stabilitas bendungan pasca konstruksi.	2025-12-17 22:53:20.897941	2025-12-17 22:53:20.897941	2025-12-18 01:05:13.357303
3b40d456-3253-4599-8ce6-68a678e2dc5d	d2247222-4d70-4793-8616-a87565de123c	1	Menjelaskan konsep dasar transpor sedimen dan klasifikasi jenis sedimen. (CPL 05)	2025-12-17 22:53:20.901557	2025-12-17 22:53:20.901557	2025-12-18 01:05:13.363012
ecd54edd-ee03-4599-875e-f8d702edd401	d2247222-4d70-4793-8616-a87565de123c	2	Menganalisis proses pengangkutan sedimen dan laju sedimentasi. (CPL 05)	2025-12-17 22:53:20.90237	2025-12-17 22:53:20.90237	2025-12-18 01:05:13.363012
7e748ac3-58fd-4ed0-a855-e62eb2886d64	d2247222-4d70-4793-8616-a87565de123c	3	Menerapkan hasil analisis sedimen dalam perencanaan pengendalian sedimentasi. (CPL 05)	2025-12-17 22:53:20.903055	2025-12-17 22:53:20.903055	2025-12-18 01:05:13.363012
763cd36a-f1c4-4b2f-b84e-7de38f1be1ce	d2247222-4d70-4793-8616-a87565de123c	4	Melakukan simulasi atau eksperimen sederhana terkait transpor sedimen. (CPL 02)	2025-12-17 22:53:20.903714	2025-12-17 22:53:20.903714	2025-12-18 01:05:13.363012
8a624d55-f8da-4346-a38e-b7b83a878cbe	913429ba-2d7b-427a-a910-a6613d4eea01	1	Menjelaskan jenis dan fungsi bangunan irigasi sekunder dan tersier. (CPL 02)	2025-12-17 22:53:20.905825	2025-12-17 22:53:20.905825	2025-12-18 01:05:13.36723
948b52d7-8b62-4fd1-b8e9-5464d885aa9f	913429ba-2d7b-427a-a910-a6613d4eea01	2	Menghitung kapasitas dan dimensi bangunan irigasi berdasarkan data hidrologi. (CPL 02)	2025-12-17 22:53:20.906498	2025-12-17 22:53:20.906498	2025-12-18 01:05:13.36723
f62add89-6d18-43c7-a261-e5217fdf0b36	913429ba-2d7b-427a-a910-a6613d4eea01	3	Merancang bangunan irigasi secara teknis dan ekonomis. (CPL 02)	2025-12-17 22:53:20.907237	2025-12-17 22:53:20.907237	2025-12-18 01:05:13.36723
39e38e43-c561-4a99-a5cc-0f7ccbb624ca	913429ba-2d7b-427a-a910-a6613d4eea01	4	Mengevaluasi kinerja bangunan irigasi eksisting di lapangan. (CPL 05)	2025-12-17 22:53:20.908015	2025-12-17 22:53:20.908015	2025-12-18 01:05:13.36723
27ccea35-a1c8-4821-a72e-e26c06265cfd	913429ba-2d7b-427a-a910-a6613d4eea01	5	Mempresentasikan hasil perencanaan dan evaluasi bangunan irigasi. (CPL 05)	2025-12-17 22:53:20.908752	2025-12-17 22:53:20.908752	2025-12-18 01:05:13.36723
047fdc12-31c1-43c2-99c5-bc4168126c5b	c50c57e9-cc1c-496a-adba-ed79d52e9020	1	Menjelaskan klasifikasi dan fungsi jaringan irigasi.	2025-12-17 22:53:20.910283	2025-12-17 22:53:20.910283	2025-12-18 01:05:13.371905
0bc68075-9a8d-4f77-8dc8-e0062d9313e8	c50c57e9-cc1c-496a-adba-ed79d52e9020	2	Menghitung kebutuhan air irigasi berdasarkan data klimatologi dan tanaman.	2025-12-17 22:53:20.911051	2025-12-17 22:53:20.911051	2025-12-18 01:05:13.371905
ca5763bb-e2c1-4f40-9ca6-6b9c7a6e2efc	c50c57e9-cc1c-496a-adba-ed79d52e9020	3	Menganalisis kapasitas saluran irigasi dan debit desain.	2025-12-17 22:53:20.911837	2025-12-17 22:53:20.911837	2025-12-18 01:05:13.371905
40381899-198c-4d6b-b45b-b809a922fa0b	c50c57e9-cc1c-496a-adba-ed79d52e9020	4	Merancang sistem jaringan irigasi dari intake hingga saluran tersier.	2025-12-17 22:53:20.913281	2025-12-17 22:53:20.913281	2025-12-18 01:05:13.371905
95d117f8-eae1-499f-be87-982d1ab394d7	c50c57e9-cc1c-496a-adba-ed79d52e9020	5	Menyusun laporan teknis dan presentasi desain jaringan irigasi.	2025-12-17 22:53:20.914329	2025-12-17 22:53:20.914329	2025-12-18 01:05:13.371905
54b0ead9-7dd6-4be0-8498-fa1f7feeb3b8	d9506bc8-a306-4480-be16-e0b8a06fff61	1	Menjelaskan karakteristik proses pantai dan pengaruh gelombang laut terhadap garis pantai. (CPL 04)	2025-12-17 22:53:20.915907	2025-12-17 22:53:20.915907	2025-12-18 01:05:13.376434
67ea51f6-6b19-410d-96db-b6515c341a73	d9506bc8-a306-4480-be16-e0b8a06fff61	2	Mengidentifikasi dan menjelaskan jenis bangunan pelindung pantai. (CPL 04)	2025-12-17 22:53:20.916681	2025-12-17 22:53:20.916681	2025-12-18 01:05:13.376434
44c0c8c3-3e9a-42f6-800c-b9c4062972ed	d9506bc8-a306-4480-be16-e0b8a06fff61	3	Merancang bangunan pantai berdasarkan kondisi gelombang dan garis pantai. (CPL 05)	2025-12-17 22:53:20.917436	2025-12-17 22:53:20.917436	2025-12-18 01:05:13.376434
0c402ded-e3a6-43ff-a7ad-567185e3a836	d9506bc8-a306-4480-be16-e0b8a06fff61	4	Menganalisis proyek reklamasi dan dampaknya terhadap lingkungan pesisir. (CPL 04)	2025-12-17 22:53:20.918279	2025-12-17 22:53:20.918279	2025-12-18 01:05:13.376434
7bdf4758-ce78-4f75-8ba2-eaada95961fe	bc629e61-ef3f-41a1-9958-73d5a2094ada	1	Menjelaskan konsep dasar hidrogeologi dan sistem akuifer. (CPL 02)	2025-12-17 22:53:20.920686	2025-12-17 22:53:20.920686	2025-12-18 01:05:13.382155
0848b212-fb64-49ec-9943-26ab53d4b8e1	bc629e61-ef3f-41a1-9958-73d5a2094ada	2	Menganalisis parameter hidraulik dan keseimbangan air tanah. (CPL 02)	2025-12-17 22:53:20.921442	2025-12-17 22:53:20.921442	2025-12-18 01:05:13.382155
1923ba34-54ca-4383-a0e4-5ec24303ec4c	bc629e61-ef3f-41a1-9958-73d5a2094ada	3	Menerapkan metode pemetaan dan pemodelan aliran air tanah. (CPL 05)	2025-12-17 22:53:20.922096	2025-12-17 22:53:20.922096	2025-12-18 01:05:13.382155
2162346b-965f-4bc0-a9dc-32129e9ac0cc	bc629e61-ef3f-41a1-9958-73d5a2094ada	4	Merancang strategi pengelolaan air tanah secara berkelanjutan. (CPL 02)	2025-12-17 22:53:20.922709	2025-12-17 22:53:20.922709	2025-12-18 01:05:13.382155
8cdb2bb0-02a3-46dc-b4ec-857246257bb5	bc629e61-ef3f-41a1-9958-73d5a2094ada	5	Menyusun laporan teknis dan rekomendasi tata kelola air tanah. (CPL 02)	2025-12-17 22:53:20.923333	2025-12-17 22:53:20.923333	2025-12-18 01:05:13.382155
643f2e0e-fe36-4c7b-9c6e-b58b1cb6d642	7e8c1886-5348-4f66-987c-0b736b5fceab	1	Menjelaskan fungsi dan klasifikasi waduk berdasarkan tujuan dan skala. (CPL 02)	2025-12-17 22:53:20.925198	2025-12-17 22:53:20.925198	2025-12-18 01:05:13.386814
ff186f19-1431-412a-ad3b-fa997de579b0	7e8c1886-5348-4f66-987c-0b736b5fceab	2	Menghitung kapasitas tampungan dan volume efektif waduk. (CPL 07)	2025-12-17 22:53:20.925871	2025-12-17 22:53:20.925871	2025-12-18 01:05:13.386814
07e56b8e-5e35-40e7-9fd2-47bfbdb0210a	7e8c1886-5348-4f66-987c-0b736b5fceab	3	Menganalisis kebutuhan air tahunan dan fluktuasi debit masuk. (CPL 07)	2025-12-17 22:53:20.926497	2025-12-17 22:53:20.926497	2025-12-18 01:05:13.386814
1f232d46-56ab-4601-88ca-bd73cf74f6c5	7e8c1886-5348-4f66-987c-0b736b5fceab	4	Merancang kurva operasi waduk untuk kebutuhan multipurpose. (CPL 02)	2025-12-17 22:53:20.927129	2025-12-17 22:53:20.927129	2025-12-18 01:05:13.386814
2abe4828-a8e3-44db-91d8-ced3823670e6	7e8c1886-5348-4f66-987c-0b736b5fceab	5	Mengevaluasi pengelolaan sedimentasi dan dampak lingkungan waduk. (CPL 07)	2025-12-17 22:53:20.927814	2025-12-17 22:53:20.927814	2025-12-18 01:05:13.386814
a7dd716a-f302-4dde-9874-7ec81ce1482a	ebec4e67-a478-41c6-9605-fb24fb33d208	1	Menjelaskan konsep dasar dan klasifikasi pembangkit listrik tenaga air. (CPL 02)	2025-12-17 22:53:20.929671	2025-12-17 22:53:20.929671	2025-12-18 01:05:13.391254
8a643a35-9b60-4f19-abd6-558fcc5b35b1	ebec4e67-a478-41c6-9605-fb24fb33d208	2	Menganalisis potensi energi air berdasarkan data hidrologi dan topografi. (CPL 02)	2025-12-17 22:53:20.930576	2025-12-17 22:53:20.930576	2025-12-18 01:05:13.391254
63181bed-856a-4d58-bd89-4b2b02ee15b4	ebec4e67-a478-41c6-9605-fb24fb33d208	3	Merancang sistem PLTA sederhana sesuai kondisi teknis dan lingkungan. (CPL 02)	2025-12-17 22:53:20.931271	2025-12-17 22:53:20.931271	2025-12-18 01:05:13.391254
8d64f0c2-5c55-413f-a259-74fae7df16da	ebec4e67-a478-41c6-9605-fb24fb33d208	4	Melakukan studi kelayakan teknis dan ekonomi sederhana. (CPL 02)	2025-12-17 22:53:20.931872	2025-12-17 22:53:20.931872	2025-12-18 01:05:13.391254
29566427-5755-4e99-9e32-9936126a7d85	e4a4726b-acfe-414c-ad31-c9b5ca15d180	1	Menjelaskan klasifikasi jalan dan prinsip dasar perencanaan jalan raya. (CPL 02)	2025-12-17 22:53:20.934167	2025-12-17 22:53:20.934167	2025-12-18 01:05:13.397141
671eb781-041c-4c80-b791-3c7bbf7dbb15	e4a4726b-acfe-414c-ad31-c9b5ca15d180	2	Menganalisis elemen geometrik jalan seperti alinyemen horizontal dan vertikal. (CPL 02)	2025-12-17 22:53:20.934977	2025-12-17 22:53:20.934977	2025-12-18 01:05:13.397141
1db8e0aa-3e0c-450c-a9d9-4b728b1e929c	e4a4726b-acfe-414c-ad31-c9b5ca15d180	3	Menjelaskan jenis dan sifat material perkerasan jalan. (CPL 02)	2025-12-17 22:53:20.935672	2025-12-17 22:53:20.935672	2025-12-18 01:05:13.397141
fbc0ff68-ed1e-4eec-84b3-4aee8a8ff704	e4a4726b-acfe-414c-ad31-c9b5ca15d180	4	Merancang struktur perkerasan lentur dan kaku berdasarkan beban lalu lintas. (CPL 02)	2025-12-17 22:53:20.93633	2025-12-17 22:53:20.93633	2025-12-18 01:05:13.397141
622c3b85-cce5-4554-b584-df1db0525830	e4a4726b-acfe-414c-ad31-c9b5ca15d180	5	Menyajikan laporan teknis hasil perencanaan dan evaluasi jalan. (CPL 05)	2025-12-17 22:53:20.936929	2025-12-17 22:53:20.936929	2025-12-18 01:05:13.397141
530dd970-d25d-4476-94d4-ac183027bea3	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	1	Mengidentifikasi, menganalisis, dan merumuskan permasalahan teknis di bidang sumber daya air (irigasi, drainase, bangunan air, konservasi air, atau hidrologi terapan) berdasarkan kondisi nyata di lapangan secara sistematis dan berbasis data. (CPL 02)	2025-12-17 22:53:20.938687	2025-12-17 22:53:20.938687	2025-12-17 22:53:20.962387
4091b12d-693a-46fd-b819-ed77b961576c	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	2	menyusun alternatif solusi dan rekomendasi teknis yang tepat dan aplikatif terhadap permasalahan pengairan di lokasi KKP, dengan mempertimbangkan aspek teknis, lingkungan, sosial, dan keberlanjutan (CPL 07)	2025-12-17 22:53:20.939371	2025-12-17 22:53:20.939371	2025-12-17 22:53:20.962387
6405937d-539c-4e00-ad11-3325b37efeb9	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	3	menggunakan peralatan survei, instrumentsasi, software analisis/hidrolika/hidrologi, serta standar teknis (SNI, Permen, pedoman nasional) yang relevan dalam pelaksanaan kegiatan KKP (CPL 07)	2025-12-17 22:53:20.939997	2025-12-17 22:53:20.939997	2025-12-17 22:53:20.962387
2cc92402-fd33-43c5-acd8-9a668f3244d8	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	4	berkomunikasi secara efektif, bekerja dalam tim lintas disiplin, menunjukkan etika profesional, serta beradaptasi dengan budaya kerja instansi atau lembaga tempat pelaksanaan KKP (CPL 08)	2025-12-17 22:53:20.940829	2025-12-17 22:53:20.940829	2025-12-17 22:53:20.962387
c4cf97c1-266e-4d94-8519-4b9c1911e44c	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	5	menyusun laporan teknis KKP secara lengkap, logis, dan sesuai kaidah ilmiah, serta mempresentasikan hasil kegiatan kepada dosen pembimbing dan pihak instansi secara profesional (CPL 07)	2025-12-17 22:53:20.942105	2025-12-17 22:53:20.942105	2025-12-17 22:53:20.962387
0e47812f-7ee0-4f30-93d9-078ae0730c8c	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	6	Menginternalisasi dan menerapkan nilai-nilai Kemuhammadiyahan dalam kegiatan KKP melalui sikap amanah, kejujuran, kepedulian sosial, serta berkontribusi dalam kegiatan pengabdian masyarakat yang relevan dengan pengairan dan pemberdayaan lingkungan (CPL 07)	2025-12-17 22:53:20.942805	2025-12-17 22:53:20.942805	2025-12-17 22:53:20.962387
e71044be-436b-452c-bea8-873e66f49fe0	e3dd615e-480b-44e7-9f81-12d050728519	1	Mengintegrasikan pengetahuan dan keterampilan teknik pengairan untuk merancang proyek SDA. (CPL 04)	2025-12-17 22:53:20.9446	2025-12-17 22:53:20.9446	2025-12-17 22:53:20.968203
7b9409dd-f27f-42e1-ac65-ece39586258b	e3dd615e-480b-44e7-9f81-12d050728519	2	Menerapkan prinsip rekayasa dalam pengembangan desain detail. (CPL 05)	2025-12-17 22:53:20.945705	2025-12-17 22:53:20.945705	2025-12-17 22:53:20.968203
08ec390b-03cd-40e1-b360-497a096e519f	e3dd615e-480b-44e7-9f81-12d050728519	3	Mempertimbangkan aspek hukum, ekonomi, lingkungan, sosial, dan keselamatan. (CPL 02)	2025-12-17 22:53:20.946611	2025-12-17 22:53:20.946611	2025-12-17 22:53:20.968203
db5b8493-c7ca-456c-949b-77aa4ac2ef99	e3dd615e-480b-44e7-9f81-12d050728519	4	Bekerja efektif dalam tim multidisiplin. (CPL 08)	2025-12-17 22:53:20.947462	2025-12-17 22:53:20.947462	2025-12-17 22:53:20.968203
ccf76f18-b741-4ff0-a566-f034ad44c9c2	e3dd615e-480b-44e7-9f81-12d050728519	5	Menyajikan hasil proyek secara lisan dan tertulis dengan baik. (CPL 06)	2025-12-17 22:53:20.948181	2025-12-17 22:53:20.948181	2025-12-17 22:53:20.968203
c367cb24-71b1-49b5-8c99-a5db72abc1fd	e3dd615e-480b-44e7-9f81-12d050728519	6	Menunjukkan sikap profesional dan etis dalam proses perancangan. (CPL 09)	2025-12-17 22:53:20.948901	2025-12-17 22:53:20.948901	2025-12-17 22:53:20.968203
e2da0f79-beec-4492-b5dc-00ec9a1074b3	e3dd615e-480b-44e7-9f81-12d050728519	7	Menunjukkan kesadaran terhadap pembelajaran sepanjang hayat. (CPL 10)	2025-12-17 22:53:20.94955	2025-12-17 22:53:20.94955	2025-12-17 22:53:20.968203
96da2b47-7da2-4a65-8c6d-567d36a49680	957683e2-4f71-4e02-b7eb-245d625ba14b	1	merumuskan latar belakang, ruang lingkup, dan identifikasi masalah penelitian secara sistematis dan didukung data atau fenomena relevan di bidang teknik pengairan. (CPL 03)	2025-12-17 22:53:20.951107	2025-12-17 22:53:20.951107	2025-12-17 22:53:20.974763
fab3f01a-bf68-4955-8a35-1c854a65bd48	957683e2-4f71-4e02-b7eb-245d625ba14b	2	menyusun rumusan masalah, tujuan penelitian, batasan penelitian, serta manfaat penelitian secara jelas, logis, dan terukur (CPL 03)	2025-12-17 22:53:20.952174	2025-12-17 22:53:20.952174	2025-12-17 22:53:20.974763
d5f721a1-ee82-4f3c-9f7b-e83e46acead5	957683e2-4f71-4e02-b7eb-245d625ba14b	3	mengumpulkan, menelaah, dan menyintesis literatur ilmiah (jurnal, SNI, pedoman teknis, buku referensi) untuk mendukung konsep, teori, dan metodologi yang digunakan dalam usulan penelitian (CPL 03)	2025-12-17 22:53:20.953198	2025-12-17 22:53:20.953198	2025-12-17 22:53:20.974763
80d3224a-11ac-481d-b470-d1fb4306e038	957683e2-4f71-4e02-b7eb-245d625ba14b	4	menyusun metodologi penelitian yang tepat dan relevan, termasuk metode pengumpulan data, teknik analisis hidrologi/hidrolika/sumber daya air, serta perencanaan alat dan perangkat lunak yang akan digunakan (CPL 03)	2025-12-17 22:53:20.953981	2025-12-17 22:53:20.953981	2025-12-17 22:53:20.974763
f192d2e7-a40f-4887-b17d-3c4b95a21b44	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	1	Merumuskan masalah penelitian yang relevan dengan bidang teknik sumber daya air. (CPL 04)	2025-12-17 22:53:20.957116	2025-12-17 22:53:20.957116	2025-12-17 22:53:20.98037
7beb9e0f-3fbe-412f-9778-31f4d5f83688	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	2	Melakukan kajian pustaka yang komprehensif. (CPL 04)	2025-12-17 22:53:20.957812	2025-12-17 22:53:20.957812	2025-12-17 22:53:20.98037
7099a8fa-f967-4ab5-af68-3bf16e4b63ab	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	3	Merancang metodologi penelitian yang sesuai. (CPL 05)	2025-12-17 22:53:20.958454	2025-12-17 22:53:20.958454	2025-12-17 22:53:20.98037
1ead3928-d08f-4eb1-9cd6-4195d5b4bb9e	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	4	Mengumpulkan dan menganalisis data penelitian. (CPL 03)	2025-12-17 22:53:20.959118	2025-12-17 22:53:20.959118	2025-12-17 22:53:20.98037
7e71ffd6-fea0-44ee-8d9f-c53ed1625270	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	5	Menyajikan hasil penelitian dalam bentuk laporan ilmiah. (CPL 03)	2025-12-17 22:53:20.959836	2025-12-17 22:53:20.959836	2025-12-17 22:53:20.98037
d12be7ec-35b8-4ee7-8ccb-a263c361ebb7	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	6	Mempertahankan hasil penelitian di hadapan penguji. (CPL 06)	2025-12-17 22:53:20.960489	2025-12-17 22:53:20.960489	2025-12-17 22:53:20.98037
0c3a7be2-80ac-4156-8b65-2f97e5e25dce	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	7	Menunjukkan sikap profesional, etis, dan mandiri dalam penelitian. (CPL 09)	2025-12-17 22:53:20.961185	2025-12-17 22:53:20.961185	2025-12-17 22:53:20.98037
159e167a-baaa-4992-85b0-06b0c96a51cc	036843d8-177a-4b11-8928-1d560a7b4d1d	4	Mahasiswa mampu menggunakan teknik penulisan akademik untuk mendukung publikasi dan presentasi ilmiah.	2025-12-17 22:53:20.70687	2025-12-17 22:53:20.70687	2025-12-18 01:05:13.140924
85dc3d68-7a6e-492a-89d8-c14a9dde41d5	20ee1278-a3ba-4e5a-8cdd-243629c31a56	4	berbicara dan berinteraksi dalam bahasa Inggris pada situasi sehari-hari, memperkenalkan diri, memberikan pendapat sederhana, berdiskusi dalam kelompok kecil, dan menyampaikan informasi dasar dengan pelafalan yang dapat dipahami (CPL 10)	2025-12-17 22:53:20.710221	2025-12-17 22:53:20.710221	2025-12-18 01:05:13.147597
44cbd48e-b79e-4f42-b6cf-2353c4e53678	20ee1278-a3ba-4e5a-8cdd-243629c31a56	1	memahami informasi lisan dalam percakapan sehari-hari dan situasi umum, seperti percakapan sosial, instruksi sederhana, dan dialog akademik dasar (CPL 06)	2025-12-18 01:05:13.148588	2025-12-18 19:26:54.079336	\N
e4ac861a-4ad7-4609-84ab-8bb7db329c8d	ef59bbe0-fbb1-4b7e-8af6-edc29da9d512	5	asdasdasd	2025-12-18 19:38:00.871117	2025-12-18 19:38:00.871117	2025-12-18 19:38:49.048375
7fdba7d2-7d46-42bd-9f03-ffcb32635b07	036843d8-177a-4b11-8928-1d560a7b4d1d	1	Mahasiswa mampu menyusun tulisan ilmiah yang efektif, logis, dan sesuai kaidah bahasa Indonesia akademik. (CPL 06)	2025-12-18 01:05:13.142329	2025-12-18 19:35:40.548691	\N
e3ed5bc2-5a06-4468-9afc-9f0f1fd3299c	036843d8-177a-4b11-8928-1d560a7b4d1d	2	Mahasiswa mampu mengevaluasi penggunaan bahasa dalam laporan, makalah, dan tulisan sumber daya air secara profesional.	2025-12-18 01:05:13.144268	2025-12-18 19:35:40.551768	\N
27058dec-7b69-4b7b-b471-cc1b28b4f71b	036843d8-177a-4b11-8928-1d560a7b4d1d	3	Mahasiswa mampu berkomunikasi secara tertulis untuk menyampaikan ide sumber daya air secara informatif dan etis.	2025-12-18 01:05:13.145502	2025-12-18 19:35:40.552819	\N
613bdbcb-4e2a-410c-ab43-051f3fb84657	036843d8-177a-4b11-8928-1d560a7b4d1d	4	Mahasiswa mampu menggunakan teknik penulisan akademik untuk mendukung publikasi dan presentasi ilmiah.	2025-12-18 01:05:13.146486	2025-12-18 19:35:40.553852	\N
a64bcd67-1071-4d9d-93a8-242987987a02	957683e2-4f71-4e02-b7eb-245d625ba14b	5	menyusun proposal penelitian secara lengkap, sistematis, dan sesuai kaidah ilmiah, termasuk format penulisan, struktur laporan, sitasi, dan etika akademik. (CPL 03)	2025-12-17 22:53:20.954768	2025-12-17 22:53:20.954768	2025-12-17 22:53:20.974763
720fd163-0591-42a2-a3b7-6aeac15ae81c	957683e2-4f71-4e02-b7eb-245d625ba14b	6	mempresentasikan usulan penelitian secara efektif, menjawab pertanyaan dan argumen dari dosen/penilai secara kritis dan ilmiah, serta menunjukkan penguasaan substansi penelitian di bidang teknik pengairan (CPL 06)	2025-12-17 22:53:20.955558	2025-12-17 22:53:20.955558	2025-12-17 22:53:20.974763
2b378413-06a2-49dd-906d-bcd652508df1	ef59bbe0-fbb1-4b7e-8af6-edc29da9d512	1	menjelaskan prinsip-prinsip dasar ajaran Islam terkait etika, akhlak, dan profesionalitas. (CPL 09)	2025-12-17 22:53:20.680627	2025-12-17 22:53:20.680627	2025-12-18 01:05:13.120221
11fe1e8f-1858-4a53-9257-0bed1892dbd7	ef59bbe0-fbb1-4b7e-8af6-edc29da9d512	2	Mahasiswa mampu menerapkan nilai-nilai keislaman dalam sikap, perilaku akademik, dan pengambilan keputusan. (CPL 10)	2025-12-17 22:53:20.69296	2025-12-17 22:53:20.69296	2025-12-18 01:05:13.120221
2919f24e-18e2-4f70-9a8a-cb438d4a5d28	ef59bbe0-fbb1-4b7e-8af6-edc29da9d512	3	Mahasiswa mampu mengintegrasikan ajaran Islam dengan konteks sosial, budaya, dan profesi teknik pengairan. (CPL 10)	2025-12-17 22:53:20.693823	2025-12-17 22:53:20.693823	2025-12-18 01:05:13.120221
99fb124a-016c-456c-bd7c-9b0359a86ccf	ef59bbe0-fbb1-4b7e-8af6-edc29da9d512	4	Mahasiswa mampu menunjukkan komitmen terhadap nilai keberlanjutan, amanah, dan keadilan dalam praktik akademik. (CPL 08)	2025-12-17 22:53:20.694559	2025-12-17 22:53:20.694559	2025-12-18 01:05:13.120221
9bafc847-3b41-4e5d-a9a7-bef824f73d68	e3dd615e-480b-44e7-9f81-12d050728519	1	Mengintegrasikan pengetahuan dan keterampilan teknik pengairan untuk merancang proyek SDA. (CPL 04)	2025-12-17 22:53:20.969465	2025-12-17 22:53:20.969465	2025-12-18 01:05:13.406958
25b950b8-1a14-45d5-9229-2dd085cb020b	e3dd615e-480b-44e7-9f81-12d050728519	2	Menerapkan prinsip rekayasa dalam pengembangan desain detail. (CPL 05)	2025-12-17 22:53:20.970173	2025-12-17 22:53:20.970173	2025-12-18 01:05:13.406958
52cde6fd-9bc7-4e52-b784-a88bae70dfee	e3dd615e-480b-44e7-9f81-12d050728519	3	Mempertimbangkan aspek hukum, ekonomi, lingkungan, sosial, dan keselamatan. (CPL 02)	2025-12-17 22:53:20.970848	2025-12-17 22:53:20.970848	2025-12-18 01:05:13.406958
21f12bab-740d-459d-b409-5a0b2b5d254c	957683e2-4f71-4e02-b7eb-245d625ba14b	1	merumuskan latar belakang, ruang lingkup, dan identifikasi masalah penelitian secara sistematis dan didukung data atau fenomena relevan di bidang teknik pengairan. (CPL 03)	2025-12-17 22:53:20.975634	2025-12-17 22:53:20.975634	2025-12-18 01:05:13.416624
c3a88c83-e02a-439a-829f-c0a4f004fa2f	957683e2-4f71-4e02-b7eb-245d625ba14b	2	menyusun rumusan masalah, tujuan penelitian, batasan penelitian, serta manfaat penelitian secara jelas, logis, dan terukur (CPL 03)	2025-12-17 22:53:20.976352	2025-12-17 22:53:20.976352	2025-12-18 01:05:13.416624
01c6e936-3281-4640-acbe-08b468842792	957683e2-4f71-4e02-b7eb-245d625ba14b	3	mengumpulkan, menelaah, dan menyintesis literatur ilmiah (jurnal, SNI, pedoman teknis, buku referensi) untuk mendukung konsep, teori, dan metodologi yang digunakan dalam usulan penelitian (CPL 03)	2025-12-17 22:53:20.977047	2025-12-17 22:53:20.977047	2025-12-18 01:05:13.416624
38358590-3d1e-4185-873a-996bbe784f4f	957683e2-4f71-4e02-b7eb-245d625ba14b	4	menyusun metodologi penelitian yang tepat dan relevan, termasuk metode pengumpulan data, teknik analisis hidrologi/hidrolika/sumber daya air, serta perencanaan alat dan perangkat lunak yang akan digunakan (CPL 03)	2025-12-17 22:53:20.977758	2025-12-17 22:53:20.977758	2025-12-18 01:05:13.416624
7affdbb3-f023-4794-ad5a-4523a7d8439a	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	1	Merumuskan masalah penelitian yang relevan dengan bidang teknik sumber daya air. (CPL 04)	2025-12-17 22:53:20.981441	2025-12-17 22:53:20.981441	2025-12-18 01:05:13.425303
f379855d-0b8c-434b-94c2-68e395b83fe8	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	2	Melakukan kajian pustaka yang komprehensif. (CPL 04)	2025-12-17 22:53:20.982164	2025-12-17 22:53:20.982164	2025-12-18 01:05:13.425303
54f25120-12c9-4fd8-b560-66e286f225b7	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	3	Merancang metodologi penelitian yang sesuai. (CPL 05)	2025-12-17 22:53:20.982852	2025-12-17 22:53:20.982852	2025-12-18 01:05:13.425303
d6398dfc-a6b4-402d-b8f9-3947dd01c851	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	4	Mengumpulkan dan menganalisis data penelitian. (CPL 03)	2025-12-17 22:53:20.983563	2025-12-17 22:53:20.983563	2025-12-18 01:05:13.425303
8aed4f7a-a3de-4525-bb07-7302bdb0a823	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	5	Menyajikan hasil penelitian dalam bentuk laporan ilmiah. (CPL 03)	2025-12-17 22:53:20.984347	2025-12-17 22:53:20.984347	2025-12-18 01:05:13.425303
e041230e-60e9-49fd-82bd-5dfc9b1f2b3d	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	6	Mempertahankan hasil penelitian di hadapan penguji. (CPL 06)	2025-12-17 22:53:20.985277	2025-12-17 22:53:20.985277	2025-12-18 01:05:13.425303
5af90a40-6af0-4d86-bba0-b5ceed9b2cd6	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	7	Menunjukkan sikap profesional, etis, dan mandiri dalam penelitian. (CPL 09)	2025-12-17 22:53:20.98615	2025-12-17 22:53:20.98615	2025-12-18 01:05:13.425303
23e81b3a-feb7-433e-aa60-f708f8ed06fa	8c7b796e-6bf7-4f51-b8fd-f5831900298b	1	Menjelaskan konsep limit dan kontinuitas fungsi satu variabel. (CPL 01)	2025-12-18 01:05:13.137089	2025-12-18 19:33:14.722991	\N
7e075fc4-d1fb-4a03-95f7-b8297c19cecd	8c7b796e-6bf7-4f51-b8fd-f5831900298b	2	Menerapkan aturan turunan dalam menyelesaikan persoalan teknik. CPL 01)	2025-12-18 01:05:13.137845	2025-12-18 19:33:14.724081	\N
b0409c47-c9d6-43dc-bf46-142c5e2300a1	8c7b796e-6bf7-4f51-b8fd-f5831900298b	3	Menganalisis grafik fungsi menggunakan turunan pertama dan kedua. (CPL 04)	2025-12-18 01:05:13.13858	2025-12-18 19:33:14.725121	\N
163d651d-b93b-48ba-88c1-d18886a5a6e6	8c7b796e-6bf7-4f51-b8fd-f5831900298b	4	Menghitung integral tak tentu dan tertentu dari fungsi polinomial. (CPL 04)	2025-12-18 01:05:13.139287	2025-12-18 19:33:14.725642	\N
04fb56ee-3e5d-4350-96df-235cb53392c4	8c7b796e-6bf7-4f51-b8fd-f5831900298b	5	Menyusun model matematika sederhana (CPL 04)	2025-12-18 01:05:13.139999	2025-12-18 19:33:14.726689	\N
15115554-2123-4b20-9e18-02cae291b92d	a282cd65-55b7-46c5-9f6c-90cc3a10286f	1	Mahasiswa mampu menjelaskan nilai, prinsip, dan sistem etika Pancasila dalam kehidupan berbangsa dan bernegara. (CPL 09)	2025-12-18 01:05:13.132609	2025-12-18 19:36:06.801769	\N
928ec3bc-a137-477a-b4d0-973a3f072708	a282cd65-55b7-46c5-9f6c-90cc3a10286f	2	Mahasiswa mampu menganalisis persoalan sosial dan profesional menggunakan perspektif etika Pancasila. (CPL 08)	2025-12-18 01:05:13.13355	2025-12-18 19:36:06.802933	\N
cc2a1b75-7c79-4184-9538-0af291f9ee28	a282cd65-55b7-46c5-9f6c-90cc3a10286f	3	Mahasiswa mampu menunjukkan sikap integritas, moralitas, dan tanggung jawab sosial dalam aktivitas akademik. (CPL 09)	2025-12-18 01:05:13.134352	2025-12-18 19:36:06.804091	\N
bd1af714-ab16-4c7c-9771-ea24395aa22e	a282cd65-55b7-46c5-9f6c-90cc3a10286f	4	Mahasiswa mampu menerapkan nilai-nilai Pancasila sebagai dasar pengambilan keputusan yang adil dan berkeadilan sosial. (CPL 08)	2025-12-18 01:05:13.135116	2025-12-18 19:36:06.804668	\N
e2823eb9-aa8d-408a-9d67-1b948992e2ca	ef59bbe0-fbb1-4b7e-8af6-edc29da9d512	1	menjelaskan prinsip-prinsip dasar ajaran Islam terkait etika, akhlak, dan profesionalitas. (CPL 09)	2025-12-18 01:05:13.124094	2025-12-18 19:35:56.748135	\N
cc5029b1-5d47-4817-ac16-7fec41362a79	ef59bbe0-fbb1-4b7e-8af6-edc29da9d512	2	Mahasiswa mampu menerapkan nilai-nilai keislaman dalam sikap, perilaku akademik, dan pengambilan keputusan. (CPL 10)	2025-12-18 01:05:13.128027	2025-12-18 19:35:56.749249	\N
c19e8c80-4179-4f23-81ec-0fca1338eac1	ef59bbe0-fbb1-4b7e-8af6-edc29da9d512	3	Mahasiswa mampu mengintegrasikan ajaran Islam dengan konteks sosial, budaya, dan profesi teknik pengairan. (CPL 10)	2025-12-18 01:05:13.129419	2025-12-18 19:35:56.749853	\N
5167cbdd-d5b2-41f5-a245-d2e1d87ff63f	ef59bbe0-fbb1-4b7e-8af6-edc29da9d512	4	Mahasiswa mampu menunjukkan komitmen terhadap nilai keberlanjutan, amanah, dan keadilan dalam praktik akademik. (CPL 08)	2025-12-18 01:05:13.130355	2025-12-18 19:35:56.750944	\N
8c413dbb-02a0-456b-9f21-9b38c2dec2e8	39ff239d-95de-4729-a5ff-ff416e88808a	1	menjelaskan komponen dasar sistem komputer, termasuk perangkat keras, perangkat lunak, sistem operasi, penyimpanan data (CPL 01)	2025-12-18 01:05:13.153208	2025-12-18 01:05:13.153208	\N
24d85529-daee-49b5-b4d5-39deb2ace661	39ff239d-95de-4729-a5ff-ff416e88808a	2	mengoperasikan sistem operasi (Windows/Linux) untuk melakukan manajemen file, pengaturan dasar, instalasi sederhana, dan navigasi perangkat komputer secara efektif (CPL 05)	2025-12-18 01:05:13.153927	2025-12-18 01:05:13.153927	\N
68796b28-d39a-4f20-a772-84ce8d71dce4	39ff239d-95de-4729-a5ff-ff416e88808a	3	menggunakan aplikasi perkantoran dasar (word processing, spreadsheet, dan presentation) untuk membuat dokumen tekstual, tabel data, grafik sederhana, dan presentasi sesuai standar akademik (CPL 05)	2025-12-18 01:05:13.154589	2025-12-18 01:05:13.154589	\N
f5abd13e-4ad2-4475-8226-8765c5a5af92	39ff239d-95de-4729-a5ff-ff416e88808a	4	Menggunakan internet, mesin pencari, email, dan platform digital secara efektif serta memahami etika digital, keamanan siber dasar, dan penggunaan teknologi secara bertanggung jawab (CPL 05)	2025-12-18 01:05:13.155303	2025-12-18 01:05:13.155303	\N
72774c30-2005-4c92-b81d-c1008fb070f0	1758d5ea-1a7a-48ee-8f4e-826e4b9c0775	1	Menjelaskan konsep kinematika gerak lurus dan gerak melingkar. (CPL 01)	2025-12-18 01:05:13.157464	2025-12-18 01:05:13.157464	\N
0decac0a-d5b7-49fd-b988-21381f770752	1758d5ea-1a7a-48ee-8f4e-826e4b9c0775	2	Menganalisis masalah dinamika menggunakan hukum Newton. (CPL 04)	2025-12-18 01:05:13.158194	2025-12-18 01:05:13.158194	\N
c9dd549f-e14e-416e-8579-a8fb44ec2cde	1758d5ea-1a7a-48ee-8f4e-826e4b9c0775	3	Menghitung usaha, energi kinetik, energi potensial, dan penerapannya. (CPL 04)	2025-12-18 01:05:13.158889	2025-12-18 01:05:13.158889	\N
28f11484-ffde-47e4-8d19-7b21c07bd87a	1758d5ea-1a7a-48ee-8f4e-826e4b9c0775	4	Menganalisis tumbukan dan hukum kekekalan momentum. (CPL 04)	2025-12-18 01:05:13.159567	2025-12-18 01:05:13.159567	\N
9f7638f5-fcc0-47bb-bf2b-69243395a675	1758d5ea-1a7a-48ee-8f4e-826e4b9c0775	5	Menjelaskan konsep getaran dan gelombang serta aplikasinya. (CPL 01)	2025-12-18 01:05:13.160735	2025-12-18 01:05:13.160735	\N
7af5fe78-5dc9-4047-84d2-7f7b09fbad3d	3b97e512-deac-437f-a7af-0a5adb890730	1	Menjelaskan prinsip dan standar dalam gambar teknik. (CPL 02)	2025-12-18 01:05:13.162875	2025-12-18 01:05:13.162875	\N
d72ada0f-fea9-4761-b9aa-5f4ecb7695c7	3b97e512-deac-437f-a7af-0a5adb890730	2	Menggambar proyeksi ortogonal dan tampak potongan bangunan teknik secara manual. (CPL 02)	2025-12-18 01:05:13.16363	2025-12-18 01:05:13.16363	\N
7d1083e8-ee66-4610-bed5-d32f31ff2516	3b97e512-deac-437f-a7af-0a5adb890730	3	Mengoperasikan perangkat lunak CAD (Computer Aided Design) dasar. (CPL 05)	2025-12-18 01:05:13.164386	2025-12-18 01:05:13.164386	\N
d103c385-bd4b-4745-9233-6df86759c469	3b97e512-deac-437f-a7af-0a5adb890730	4	Menganalisis gambar teknik dan mengoreksi kesalahan gambar. (CPL 02)	2025-12-18 01:05:13.165143	2025-12-18 01:05:13.165143	\N
f3b03290-0a1d-431d-8cb6-1baa65dc90ec	3b97e512-deac-437f-a7af-0a5adb890730	5	Mempresentasikan hasil gambar teknik secara komunikatif dan profesional. (CPL 05)	2025-12-18 01:05:13.165869	2025-12-18 01:05:13.165869	\N
3080b42f-67dd-4f94-b94e-a4d18cb1f7ea	186aa49d-2f32-4047-a3ed-9c9f7eead726	1	Mahasiswa mampu menjelaskan konsep dasar ajaran Islam tentang akidah, ibadah, akhlak, dan moderasi beragama sesuai perspektif Muhammadiyah. (CPL 10)	2025-12-18 01:05:13.167571	2025-12-18 01:05:13.167571	\N
641ac69a-b804-436c-bad8-a27ab4871aa0	186aa49d-2f32-4047-a3ed-9c9f7eead726	2	Mahasiswa mampu menganalisis nilai-nilai Islam dalam kehidupan sosial, budaya, dan profesional, serta keterkaitannya dengan pembangunan masyarakat. (CPL 10)	2025-12-18 01:05:13.168325	2025-12-18 01:05:13.168325	\N
6def5792-5ab2-4c6d-adcd-350f6964f6e4	186aa49d-2f32-4047-a3ed-9c9f7eead726	3	Mahasiswa mampu menerapkan prinsip etika Islam, integritas, dan tanggung jawab sosial dalam aktivitas akademik dan interaksi profesional. (CPL 10)	2025-12-18 01:05:13.169073	2025-12-18 01:05:13.169073	\N
351ecd12-5514-43dc-8c16-89cf29bb6080	186aa49d-2f32-4047-a3ed-9c9f7eead726	4	Mahasiswa mampu menginterpretasikan nilai dan pemikiran Muhammadiyah dalam merumuskan solusi terhadap isu kemasyarakatan dan tantangan kontemporer. (CPL 08)	2025-12-18 01:05:13.169761	2025-12-18 01:05:13.169761	\N
d0a66851-d47d-4445-82aa-62aaa3f338cb	15cc2515-dd94-4c3e-a7fe-66066a7c18ea	3	Membuat diagram gaya geser dan momen lentur. (CPL 04)	2025-12-17 22:53:20.728451	2025-12-17 22:53:20.728451	2025-12-18 01:05:13.1705
2a4c8d4e-74ad-4ca0-8046-5383fb17ffd0	15cc2515-dd94-4c3e-a7fe-66066a7c18ea	4	Menganalisis struktur rangka batang menggunakan metode titik simpul dan metode persamaan. (CPL 04)	2025-12-17 22:53:20.72928	2025-12-17 22:53:20.72928	2025-12-18 01:05:13.1705
9fec60b3-e44c-4a9a-bcb2-92164a38c685	15cc2515-dd94-4c3e-a7fe-66066a7c18ea	5	Menyusun laporan teknis analisis gaya struktur sederhana. (CPL 01)	2025-12-17 22:53:20.729987	2025-12-17 22:53:20.729987	2025-12-18 01:05:13.1705
c85b405a-34e9-492e-8f24-85311830f906	15cc2515-dd94-4c3e-a7fe-66066a7c18ea	1	Menjelaskan konsep gaya, momen, dan hukum kesetimbangan. (CPL 01)	2025-12-18 01:05:13.17165	2025-12-18 01:05:13.17165	\N
7b9d9a56-aee0-4d97-89e5-52d9ef3aa945	15cc2515-dd94-4c3e-a7fe-66066a7c18ea	2	Menghitung reaksi perletakan pada balok statis tertentu. (CPL 04)	2025-12-18 01:05:13.172501	2025-12-18 01:05:13.172501	\N
e494170b-d61c-489a-a9ab-67a0c693f2cf	15cc2515-dd94-4c3e-a7fe-66066a7c18ea	3	Membuat diagram gaya geser dan momen lentur. (CPL 04)	2025-12-18 01:05:13.173312	2025-12-18 01:05:13.173312	\N
bfcabce9-ab15-41cb-a499-d019e4cafde7	15cc2515-dd94-4c3e-a7fe-66066a7c18ea	4	Menganalisis struktur rangka batang menggunakan metode titik simpul dan metode persamaan. (CPL 04)	2025-12-18 01:05:13.174093	2025-12-18 01:05:13.174093	\N
1b15d997-1db1-4d88-be5a-9280870fe82f	15cc2515-dd94-4c3e-a7fe-66066a7c18ea	5	Menyusun laporan teknis analisis gaya struktur sederhana. (CPL 01)	2025-12-18 01:05:13.174881	2025-12-18 01:05:13.174881	\N
25ea6bf6-bf8a-4f29-8006-b5d146ccf014	e327f079-606a-453e-98f9-47b549931547	4	Menggunakan transformasi Laplace untuk menyelesaikan persamaan diferensial. (CPL 01)	2025-12-17 22:53:20.733192	2025-12-17 22:53:20.733192	2025-12-18 01:05:13.175986
5098c972-40b5-4e03-8439-a4f04aaf4bf5	e327f079-606a-453e-98f9-47b549931547	5	Menerapkan konsep matematika lanjut dalam studi kasus teknik pengairan. (CPL 01)	2025-12-17 22:53:20.73392	2025-12-17 22:53:20.73392	2025-12-18 01:05:13.175986
9d0be20c-0e3e-414b-a579-ee0c65a8761c	e327f079-606a-453e-98f9-47b549931547	1	Menghitung integral tak tentu dan tentu dari fungsi satu dan multi variabel. (CPL 04)	2025-12-18 01:05:13.177203	2025-12-18 01:05:13.177203	\N
56e18d73-5a7e-42c1-8dde-a5c93fc913a0	e327f079-606a-453e-98f9-47b549931547	2	Menyelesaikan persamaan diferensial orde satu dan orde dua. (CPL 04)	2025-12-18 01:05:13.178303	2025-12-18 01:05:13.178303	\N
569a0509-823e-4ce7-8c3d-59aaf9b15946	e327f079-606a-453e-98f9-47b549931547	3	Menganalisis deret tak hingga dan deret Fourier. (CPL 04)	2025-12-18 01:05:13.179185	2025-12-18 01:05:13.179185	\N
d10cbf5d-98e2-4851-b456-dd817b8eb85a	e327f079-606a-453e-98f9-47b549931547	4	Menggunakan transformasi Laplace untuk menyelesaikan persamaan diferensial. (CPL 01)	2025-12-18 01:05:13.179987	2025-12-18 01:05:13.179987	\N
fb6d3076-9a93-4b94-82c3-bceeee065c8b	e327f079-606a-453e-98f9-47b549931547	5	Menerapkan konsep matematika lanjut dalam studi kasus teknik pengairan. (CPL 01)	2025-12-18 01:05:13.180766	2025-12-18 01:05:13.180766	\N
161d35ee-f795-40e2-a195-17db8c4e97a7	c31df656-5b43-49b8-adb7-d18b652a013d	5	Memahami konsep fisika modern dasar seperti relativitas khusus dan kuantum. (CPL 01)	2025-12-17 22:53:20.73833	2025-12-17 22:53:20.73833	2025-12-18 01:05:13.181842
baca5764-4a3a-4668-8cff-be8cace11443	c31df656-5b43-49b8-adb7-d18b652a013d	1	Menjelaskan konsep dasar listrik statis dan medan listrik. (CPL 01)	2025-12-18 01:05:13.182565	2025-12-18 01:05:13.182565	\N
ab2a496d-f7df-4778-892d-0d32c67eb39e	c31df656-5b43-49b8-adb7-d18b652a013d	2	Menjelaskan konsep arus listrik, hukum Ohm, dan rangkaian listrik sederhana. (CPL 01)	2025-12-18 01:05:13.183307	2025-12-18 01:05:13.183307	\N
93fbf58e-bd0c-4468-ab65-0da999be8ef8	c31df656-5b43-49b8-adb7-d18b652a013d	3	Menganalisis potensial listrik dan energi potensial muatan. (CPL 04)	2025-12-18 01:05:13.184087	2025-12-18 01:05:13.184087	\N
f517db06-f93b-4a59-bb8c-33fde4f31739	c31df656-5b43-49b8-adb7-d18b652a013d	4	Menganalisis konsep kemagnetan dan induksi elektromagnetik. (CPL 04)	2025-12-18 01:05:13.184833	2025-12-18 01:05:13.184833	\N
fa02f650-e135-4c67-986d-eeb0adc767a8	c31df656-5b43-49b8-adb7-d18b652a013d	5	Memahami konsep fisika modern dasar seperti relativitas khusus dan kuantum. (CPL 01)	2025-12-18 01:05:13.185549	2025-12-18 01:05:13.185549	\N
fc9d8226-43fb-40ae-aea3-fbb7ef537a43	a128a351-b08f-4d99-9a34-5bf9133b4e8f	1	Menjelaskan sifat dan tekanan fluida dalam kondisi statis. (CPL 02)	2025-12-18 01:05:13.187296	2025-12-18 01:05:13.187296	\N
4a817d74-53d1-49e8-8d94-072c31e89227	a128a351-b08f-4d99-9a34-5bf9133b4e8f	2	Menerapkan hukum kontinuitas dan energi dalam aliran fluida ideal. (CPL 05)	2025-12-18 01:05:13.188168	2025-12-18 01:05:13.188168	\N
e1e2807f-ef65-46cc-a642-0a3a4fecfdd3	a19f7c46-6f8f-44b2-82d6-374ce3af07b5	1	Mahasiswa mampu menjelaskan prinsip dasar kewarganegaraan, konstitusi, nilai Pancasila, dan sistem demokrasi Indonesia secara komprehensif.	2025-12-18 01:05:13.192211	2025-12-18 01:05:13.192211	\N
d1ddfc34-e601-43a5-a7af-8315726b6513	a19f7c46-6f8f-44b2-82d6-374ce3af07b5	2	Mahasiswa mampu menganalisis isu kebangsaan, hak dan kewajiban warga negara, serta tantangan multikulturalisme dalam konteks sosial Indonesia.	2025-12-18 01:05:13.193293	2025-12-18 01:05:13.193293	\N
794fcaa3-3d6c-458a-8a3d-4a7029784782	a19f7c46-6f8f-44b2-82d6-374ce3af07b5	3	Mahasiswa mampu menunjukkan sikap etis, toleran, bertanggung jawab, serta kesadaran berbangsa dan bernegara dalam kehidupan sosial.	2025-12-18 01:05:13.194318	2025-12-18 01:05:13.194318	\N
07a40947-3585-450d-9203-9054fe8a48ab	a19f7c46-6f8f-44b2-82d6-374ce3af07b5	4	Mahasiswa mampu menerapkan perspektif kebangsaan dan nilai konstitusional dalam menilai dampak keputusan profesional di bidang sumber daya air dan masyarakat.	2025-12-18 01:05:13.195203	2025-12-18 01:05:13.195203	\N
50907816-86cc-4786-b749-49fa2346e343	d45f6a86-d4c3-41f0-9046-a6dc973001eb	1	Mahasiswa mampu memahami dan menggunakan kosakata teknis sumber daya air dalam bahasa Inggris. (CPL 10)	2025-12-18 01:05:13.197445	2025-12-18 01:05:13.197445	\N
f187ea24-1c1b-44ec-b678-d1d9b305ab85	d45f6a86-d4c3-41f0-9046-a6dc973001eb	2	Mahasiswa mampu menulis paragraf teknis, deskripsi desain, dan laporan pendek dalam bahasa Inggris akademik. (CPL 06)	2025-12-18 01:05:13.198154	2025-12-18 01:05:13.198154	\N
44a04d8e-2d97-4af8-9533-ada04f965396	d45f6a86-d4c3-41f0-9046-a6dc973001eb	3	Mahasiswa mampu mempresentasikan ide dasar sumber daya air secara lisan/tertulis menggunakan bahasa Inggris profesional. (CPL 06)	2025-12-18 01:05:13.198788	2025-12-18 01:05:13.198788	\N
3b550613-f7f2-46c3-9af8-37640d415c60	d45f6a86-d4c3-41f0-9046-a6dc973001eb	4	Mahasiswa mampu membaca, menafsirkan, dan mengutip referensi sumber daya air berbahasa Inggris. (CPL 06)	2025-12-18 01:05:13.200165	2025-12-18 01:05:13.200165	\N
b15ac610-0636-4f56-bc34-094be645b4a4	9cf0092c-4eee-4432-89a6-09da9fff56d3	1	Menjelaskan prinsip dasar pengukuran dan pemetaan topografi. (CPL 02)	2025-12-18 01:05:13.202009	2025-12-18 01:05:13.202009	\N
01148063-b8de-429e-ab5b-f2da8de148ae	9cf0092c-4eee-4432-89a6-09da9fff56d3	2	Melakukan pengukuran jarak, sudut, dan elevasi menggunakan alat ukur manual dan digital. (CPL 05)	2025-12-18 01:05:13.202976	2025-12-18 01:05:13.202976	\N
67fe1793-9517-49d2-b02d-62e04b4f5004	9cf0092c-4eee-4432-89a6-09da9fff56d3	3	Menggambar peta topografi dari data hasil pengukuran (CPL 05)	2025-12-18 01:05:13.20371	2025-12-18 01:05:13.20371	\N
f302a53e-7765-47ab-a759-23fb473c3ca2	9cf0092c-4eee-4432-89a6-09da9fff56d3	4	Mengolah data pengukuran dengan perangkat lunak sederhana. (CPL 05)	2025-12-18 01:05:13.204391	2025-12-18 01:05:13.204391	\N
f465b3b3-4dcb-49a2-8344-dd1c50c9cee4	9cf0092c-4eee-4432-89a6-09da9fff56d3	5	Menyusun laporan hasil pengukuran dan pemetaan topografi. (CPL 05)	2025-12-18 01:05:13.20547	2025-12-18 01:05:13.20547	\N
b32ead8a-dfcd-4a42-925c-34830a96720a	8fe6d386-61fa-4b94-a75b-889cc559f711	4	menjelaskan keterkaitan proses kebumian dengan sumber daya alam (air, mineral, energi) dan potensi kebencanaan geologi seperti gempa, longsor, banjir, serta upaya mitigasinya (CPL 01)	2025-12-17 22:53:20.757283	2025-12-17 22:53:20.757283	2025-12-18 01:05:13.206502
1025ae4a-2f58-4a0e-af5a-8651028f39a3	8fe6d386-61fa-4b94-a75b-889cc559f711	5	menerapkan konsep sains kebumian dalam analisis awal untuk perencanaan teknik, termasuk penentuan kondisi tanah, tata air, kestabilan lereng, dan evaluasi lingkungan pada suatu wilayah (CPL 02)	2025-12-17 22:53:20.757924	2025-12-17 22:53:20.757924	2025-12-18 01:05:13.206502
025bd782-d479-496e-aa96-c8723ba2c209	8fe6d386-61fa-4b94-a75b-889cc559f711	1	menjelaskan konsep dasar sistem Bumi, termasuk geosfer , proses internal-eksternal Bumi, dan keterkaitannya dengan fenomena alam (CPL 01)	2025-12-18 01:05:13.207333	2025-12-18 01:05:13.207333	\N
2bc66a3c-5a7c-456f-ba1f-7276950a2966	8fe6d386-61fa-4b94-a75b-889cc559f711	2	mengidentifikasi jenis batuan, mineral, tanah, serta struktur geologi berdasarkan karakteristik fisik dan proses pembentukannya, baik melalui pengamatan langsung maupun literatur (CPL 03)	2025-12-18 01:05:13.20802	2025-12-18 01:05:13.20802	\N
035cc0e0-6896-4987-806b-c7a3e7054182	8fe6d386-61fa-4b94-a75b-889cc559f711	3	menganalisis proses geologi (vulkanisme, tektonik, pelapukan, erosi, sedimentasi) dan mendeksripsikan bentuklahan (geomorfologi) serta implikasinya terhadap lingkungan dan pembangunan (CPL 05)	2025-12-18 01:05:13.208694	2025-12-18 01:05:13.208694	\N
4f45baf4-fcb1-4631-81c3-768487f1f021	8fe6d386-61fa-4b94-a75b-889cc559f711	4	menjelaskan keterkaitan proses kebumian dengan sumber daya alam (air, mineral, energi) dan potensi kebencanaan geologi seperti gempa, longsor, banjir, serta upaya mitigasinya (CPL 01)	2025-12-18 01:05:13.209328	2025-12-18 01:05:13.209328	\N
bef83e33-3680-420c-b7dc-f26d6cef875b	8fe6d386-61fa-4b94-a75b-889cc559f711	5	menerapkan konsep sains kebumian dalam analisis awal untuk perencanaan teknik, termasuk penentuan kondisi tanah, tata air, kestabilan lereng, dan evaluasi lingkungan pada suatu wilayah (CPL 02)	2025-12-18 01:05:13.210123	2025-12-18 01:05:13.210123	\N
2e80d365-737b-49a8-ae62-5f861285632a	0343526c-69a1-4dcb-8006-4d2be1763604	1	Mahasiswa mampu menjelaskan prinsip-prinsip aqidah Islam secara benar sesuai Al-Qur’an, Sunnah, dan pandangan Muhammadiyah.	2025-12-18 01:05:13.212332	2025-12-18 01:05:13.212332	\N
e0ec7dfc-6b98-45da-a623-cf7528ca42bd	0343526c-69a1-4dcb-8006-4d2be1763604	2	Mahasiswa mampu menganalisis penerapan akidah dalam pembentukan akhlak, karakter profesional, dan integritas diri di lingkungan akademik dan sosial.	2025-12-18 01:05:13.213756	2025-12-18 01:05:13.213756	\N
fd643a42-5ff9-421b-b274-0a9b2006b676	0343526c-69a1-4dcb-8006-4d2be1763604	3	Mahasiswa mampu menguraikan pemikiran, manhaj tarjih, dan peran Muhammadiyah dalam gerakan pembaruan Islam serta kontribusinya bagi pembangunan masyarakat.	2025-12-18 01:05:13.214444	2025-12-18 01:05:13.214444	\N
49ac1e73-df98-4629-90a8-691c9c648b65	0343526c-69a1-4dcb-8006-4d2be1763604	4	Mahasiswa mampu menguraikan pemikiran, manhaj tarjih, dan peran Muhammadiyah dalam gerakan pembaruan Islam serta kontribusinya bagi pembangunan masyarakat.	2025-12-18 01:05:13.215145	2025-12-18 01:05:13.215145	\N
5b30afdc-295a-4fd3-8d52-e685df201b07	655d2811-67ab-422c-a8ba-ea3ac5c932e8	4	Menyusun rencana bisnis sederhana yang berkelanjutan (CPL 04)	2025-12-17 22:53:20.765444	2025-12-17 22:53:20.765444	2025-12-18 01:05:13.216117
5be139c2-8ba2-4509-a43b-df6b23f05d48	655d2811-67ab-422c-a8ba-ea3ac5c932e8	5	Mempresentasikan rencana bisnis dan kepemimpinan tim secara profesional (CPL 04)	2025-12-17 22:53:20.76608	2025-12-17 22:53:20.76608	2025-12-18 01:05:13.216117
dc0652ea-049c-45b9-8a2e-0525acc56930	655d2811-67ab-422c-a8ba-ea3ac5c932e8	1	Menjelaskan konsep kepemimpinan dan perannya dalam dunia teknik (CPL 07)	2025-12-18 01:05:13.21733	2025-12-18 01:05:13.21733	\N
838b03a8-8613-4b98-a658-f0c3ed2bff71	655d2811-67ab-422c-a8ba-ea3ac5c932e8	2	Menganalisis keterampilan interpersonal dan komunikasi dalam tim kerja (CPL 04)	2025-12-18 01:05:13.21793	2025-12-18 01:05:13.21793	\N
926c3a04-93f6-408e-9f89-337ac99814db	655d2811-67ab-422c-a8ba-ea3ac5c932e8	3	Menjelaskan prinsip dasar kewirausahaan dan inovasi (CPL07)	2025-12-18 01:05:13.218549	2025-12-18 01:05:13.218549	\N
111d7496-4a82-4807-ad48-0b973ede2434	655d2811-67ab-422c-a8ba-ea3ac5c932e8	4	Menyusun rencana bisnis sederhana yang berkelanjutan (CPL 04)	2025-12-18 01:05:13.219236	2025-12-18 01:05:13.219236	\N
499e305d-3df8-41cd-bb9a-cada5e5ad461	655d2811-67ab-422c-a8ba-ea3ac5c932e8	5	Mempresentasikan rencana bisnis dan kepemimpinan tim secara profesional (CPL 04)	2025-12-18 01:05:13.220037	2025-12-18 01:05:13.220037	\N
4e05c23c-1798-4c5c-94d4-e8e54a94e06a	a51d25c6-1313-4fda-adf7-85ac15e80cd1	3	Mengidentifikasi dilema etika yang umum terjadi dalam praktik teknik	2025-12-17 22:53:20.769496	2025-12-17 22:53:20.769496	2025-12-18 01:05:13.221136
a4267590-4c0c-41b2-b891-38bf36372387	a51d25c6-1313-4fda-adf7-85ac15e80cd1	4	Menerapkan prinsip etika dalam pengambilan keputusan teknik yang kompleks	2025-12-17 22:53:20.770156	2025-12-17 22:53:20.770156	2025-12-18 01:05:13.221136
6896b1a4-a468-40cc-9c0a-63e8f9228f2f	a51d25c6-1313-4fda-adf7-85ac15e80cd1	5	Mempresentasikan pendapat secara profesional dan etis dalam forum akademik	2025-12-17 22:53:20.770796	2025-12-17 22:53:20.770796	2025-12-18 01:05:13.221136
d5425fb8-d9c7-458d-84dc-a42f51f03321	a51d25c6-1313-4fda-adf7-85ac15e80cd1	1	Menjelaskan konsep dasar etika profesi dan peranannya dalam dunia teknik	2025-12-18 01:05:13.222167	2025-12-18 01:05:13.222167	\N
654c7535-a1a1-48d9-991d-a8df5aba002c	a51d25c6-1313-4fda-adf7-85ac15e80cd1	2	Menganalisis kode etik profesi teknik nasional dan internasional	2025-12-18 01:05:13.223083	2025-12-18 01:05:13.223083	\N
5a99f2a5-3c12-474b-91ad-b2c0773ed59d	a51d25c6-1313-4fda-adf7-85ac15e80cd1	3	Mengidentifikasi dilema etika yang umum terjadi dalam praktik teknik	2025-12-18 01:05:13.22402	2025-12-18 01:05:13.22402	\N
d63efa4f-1bf4-478f-9366-15778a0329f7	a51d25c6-1313-4fda-adf7-85ac15e80cd1	4	Menerapkan prinsip etika dalam pengambilan keputusan teknik yang kompleks	2025-12-18 01:05:13.224941	2025-12-18 01:05:13.224941	\N
eb31e389-939e-497f-acae-5fba249cd157	a51d25c6-1313-4fda-adf7-85ac15e80cd1	5	Mempresentasikan pendapat secara profesional dan etis dalam forum akademik	2025-12-18 01:05:13.225833	2025-12-18 01:05:13.225833	\N
7245f87a-e75e-47de-9449-8d685f71b868	9aaf78bf-bdb2-4def-b106-01b309c22f39	1	Menjelaskan struktur dan komposisi bumi (CPL 06)	2025-12-18 01:05:13.228191	2025-12-18 01:05:13.228191	\N
dd8b32d6-3655-482e-ba5f-92d6e116c130	9aaf78bf-bdb2-4def-b106-01b309c22f39	2	Mengidentifikasi jenis-jenis batuan dan mineral (CPL 03)	2025-12-18 01:05:13.22902	2025-12-18 01:05:13.22902	\N
2e26c505-e3c6-49d4-9e70-17733baca455	9aaf78bf-bdb2-4def-b106-01b309c22f39	3	Menjelaskan proses-proses geologi yang mempengaruhi permukaan bumi (CPL 06)	2025-12-18 01:05:13.229713	2025-12-18 01:05:13.229713	\N
b7a96fbb-6537-448a-b1af-a2eb20e782c9	9aaf78bf-bdb2-4def-b106-01b309c22f39	4	Menerapkan pengetahuan geologi dalam perencanaan infrastruktur SDA (CPL 06)	2025-12-18 01:05:13.230371	2025-12-18 01:05:13.230371	\N
be4e9ea5-7fb0-4312-8093-f069e6e35092	9aaf78bf-bdb2-4def-b106-01b309c22f39	5	Menganalisis risiko geologi terhadap konstruksi teknik pengairan (CPL 03)	2025-12-18 01:05:13.231205	2025-12-18 01:05:13.231205	\N
f73f2859-127b-4df2-8de1-c273bcaf9d31	745858f1-604b-4421-bd20-56ab8d02ced7	5	Melakukan uji hipotesis sederhana dan analisis regresi linier (CPL 03)	2025-12-17 22:53:20.779599	2025-12-17 22:53:20.779599	2025-12-18 01:05:13.232027
106f130c-b4a7-4101-a3bb-d7db341e9d51	745858f1-604b-4421-bd20-56ab8d02ced7	1	Mampu menyajikan data dalam bentuk tabel, grafik, dan diagram (CPL 01)	2025-12-18 01:05:13.232894	2025-12-18 01:05:13.232894	\N
bf6c4f45-68d6-4cf9-9e99-4079d8067f05	745858f1-604b-4421-bd20-56ab8d02ced7	2	Menghitung ukuran pemusatan (mean, median, modus) dan ukuran penyebaran (range, varians, simpangan baku) (CPL 01)	2025-12-18 01:05:13.233664	2025-12-18 01:05:13.233664	\N
b74eaba9-6f0a-449c-9352-f7561322f4c3	745858f1-604b-4421-bd20-56ab8d02ced7	3	Menganalisis peluang kejadian menggunakan aturan peluang dasar (CPL 01)	2025-12-18 01:05:13.234408	2025-12-18 01:05:13.234408	\N
7feef143-34fe-4d1e-bfa4-cd71f5bab79c	745858f1-604b-4421-bd20-56ab8d02ced7	4	Menentukan distribusi probabilitas diskrit (binomial, Poisson) dan kontinu (normal) (CPL 01)	2025-12-18 01:05:13.235153	2025-12-18 01:05:13.235153	\N
d25f75f1-e4ac-4bd9-bb29-bc9d8af020d5	745858f1-604b-4421-bd20-56ab8d02ced7	5	Melakukan uji hipotesis sederhana dan analisis regresi linier (CPL 03)	2025-12-18 01:05:13.235893	2025-12-18 01:05:13.235893	\N
db2bf4fe-9aa9-4265-aed3-786fa5993719	83845056-e7ce-4495-b867-f8bd24a0b7fb	1	Menganalisis data hidrologi untuk perhitungan banjir rancangan (CPL 02)	2025-12-18 01:05:13.237507	2025-12-18 01:05:13.237507	\N
eaefe225-cfdc-439f-b4cb-03bd8cd91f46	83845056-e7ce-4495-b867-f8bd24a0b7fb	2	Menggunakan analisis frekuensi statistik pada data hujan dan debit (CPL 02)	2025-12-18 01:05:13.238196	2025-12-18 01:05:13.238196	\N
7508df0e-dbc6-4d25-84eb-ac998181449b	83845056-e7ce-4495-b867-f8bd24a0b7fb	3	Membangun model hidrograf satuan dari data hujan dan debit (CPL 02)	2025-12-18 01:05:13.238839	2025-12-18 01:05:13.238839	\N
9f1de394-5f3d-439f-8d91-f47625794406	83845056-e7ce-4495-b867-f8bd24a0b7fb	4	Mengaplikasikan perangkat lunak hidrologi dalam analisis curah hujan dan debit (CPL 03)	2025-12-18 01:05:13.239518	2025-12-18 01:05:13.239518	\N
7a9f4680-7541-4e20-ace5-5e5e89455f41	83845056-e7ce-4495-b867-f8bd24a0b7fb	5	Mengevaluasi hasil analisis hidrologi untuk pengambilan keputusan teknis (CPL 03)	2025-12-18 01:05:13.240202	2025-12-18 01:05:13.240202	\N
026663d4-e22e-41e6-8f73-d108773f4a42	58da71e5-9528-4f85-9649-976d128ba564	1	Menjelaskan parameter kualitas air dan standar baku mutu (CPL 02)	2025-12-18 01:05:13.241857	2025-12-18 01:05:13.241857	\N
22bd49a9-36b9-4876-b248-7e050fe1c173	58da71e5-9528-4f85-9649-976d128ba564	2	Menganalisis proses dasar pengolahan air bersih (CPL 02)	2025-12-18 01:05:13.242617	2025-12-18 01:05:13.242617	\N
e0546d4a-1219-4921-99bf-9e52c909b418	58da71e5-9528-4f85-9649-976d128ba564	3	Merancang sistem jaringan perpipaan untuk distribusi air (CPL 02)	2025-12-18 01:05:13.243351	2025-12-18 01:05:13.243351	\N
65c12eb3-c6ea-4d0c-ace6-9953dbc66615	58da71e5-9528-4f85-9649-976d128ba564	4	Menerapkan prinsip hidrolika dalam sistem perpipaan bertekanan (CPL 05)	2025-12-18 01:05:13.244387	2025-12-18 01:05:13.244387	\N
705c3674-5565-4e18-bec1-9da9baf0c1db	58da71e5-9528-4f85-9649-976d128ba564	5	Menyusun laporan dan presentasi sistem pengolahan dan jaringan distribusi (CPL 05)	2025-12-18 01:05:13.245336	2025-12-18 01:05:13.245336	\N
016442e6-4676-4593-bb4e-f221c608cb94	25b38d7a-5a8a-49a8-bc18-86328b038259	5	Menyusun dan mempresentasikan laporan K3 proyek konstruksi (CPL 09)	2025-12-17 22:53:20.791858	2025-12-17 22:53:20.791858	2025-12-18 01:05:13.246476
fec643cc-9b9c-4b6f-b452-75702c50d24a	25b38d7a-5a8a-49a8-bc18-86328b038259	1	Menjelaskan konsep dasar keselamatan dan kesehatan kerja (K3) di proyek konstruksi (CPL 05)	2025-12-18 01:05:13.247224	2025-12-18 01:05:13.247224	\N
c66151bb-a7cd-40aa-b968-cc98bc5a32af	25b38d7a-5a8a-49a8-bc18-86328b038259	2	Menganalisis standar dan regulasi K3 nasional dan internasional (CPL 05)	2025-12-18 01:05:13.247958	2025-12-18 01:05:13.247958	\N
5e075f3e-2c07-42ee-8deb-e326aa328253	25b38d7a-5a8a-49a8-bc18-86328b038259	3	Merancang sistem manajemen K3 untuk proyek konstruksi (CPL 09)	2025-12-18 01:05:13.248626	2025-12-18 01:05:13.248626	\N
93952de6-ec2b-450d-963a-ef0c2c8780a2	25b38d7a-5a8a-49a8-bc18-86328b038259	4	Mengevaluasi penerapan K3 di lapangan melalui studi kasus (CPL 09)	2025-12-18 01:05:13.249438	2025-12-18 01:05:13.249438	\N
a0309603-503b-472a-8b9c-85d42f634803	25b38d7a-5a8a-49a8-bc18-86328b038259	5	Menyusun dan mempresentasikan laporan K3 proyek konstruksi (CPL 09)	2025-12-18 01:05:13.250187	2025-12-18 01:05:13.250187	\N
3a219e58-cb91-41c7-b073-89f8a484edbe	4b04323e-5a49-431f-8f5d-889b416fea4c	4	Mahasiswa mampu menerapkan prinsip-prinsip fiqh dan nilai-nilai Kemuhammadiyahan secara etis dan bertanggung jawab dalam pengambilan keputusan akademik dan aktivitas profesional.	2025-12-17 22:53:20.795132	2025-12-17 22:53:20.795132	2025-12-18 01:05:13.251287
c1fa46c1-f4cc-4ff5-b5ee-6881e64f8394	4b04323e-5a49-431f-8f5d-889b416fea4c	1	Mahasiswa mampu menjelaskan prinsip-prinsip fiqh ibadah dan muamalah dalam Islam berdasarkan Al-Qur’an, Sunnah, dan Manhaj Tarjih Muhammadiyah.	2025-12-18 01:05:13.251919	2025-12-18 01:05:13.251919	\N
ab015d72-f8c9-438b-80d7-89c0bf0cb4e6	4b04323e-5a49-431f-8f5d-889b416fea4c	2	Mahasiswa mampu menganalisis isu-isu ibadah dan muamalah kontemporer (ekonomi, sosial, digital) menggunakan pendekatan tarjih yang rasional dan berbasis dalil.	2025-12-18 01:05:13.252659	2025-12-18 01:05:13.252659	\N
ed845bd4-8761-4205-bc52-cf288e2c67dd	4b04323e-5a49-431f-8f5d-889b416fea4c	3	Mahasiswa mampu mengevaluasi penerapan nilai ibadah, akhlak, dan muamalah Islami dalam kehidupan pribadi, sosial, dan lingkungan akademik.	2025-12-18 01:05:13.253372	2025-12-18 01:05:13.253372	\N
4d86c9d6-1144-45ae-bb3a-7737d5bda731	4b04323e-5a49-431f-8f5d-889b416fea4c	4	Mahasiswa mampu menerapkan prinsip-prinsip fiqh dan nilai-nilai Kemuhammadiyahan secara etis dan bertanggung jawab dalam pengambilan keputusan akademik dan aktivitas profesional.	2025-12-18 01:05:13.254107	2025-12-18 01:05:13.254107	\N
5b4768ba-5fc2-4357-b15b-d90fd8cbb55f	d8d56fdd-d996-40e4-bec0-f1de0e98f7f1	5	mengimplementasikan metode numerik menggunakan perangkat lunak atau bahasa pemrograman, mengolah data, serta menyajikan hasil analisis secara akurat (CPL 04)	2025-12-17 22:53:20.799271	2025-12-17 22:53:20.799271	2025-12-18 01:05:13.255212
2126dc19-1d29-4990-8e6a-450b40abd4ee	d8d56fdd-d996-40e4-bec0-f1de0e98f7f1	1	menjelaskan konsep dasar metode numerik, termasuk galat (error), stabilitas, konvergensi, dan pendekatan numerik terhadap permasalahan matematika teknik (CPL 01)	2025-12-18 01:05:13.256102	2025-12-18 01:05:13.256102	\N
1a942195-e8a2-4361-8678-7592053e35fe	d8d56fdd-d996-40e4-bec0-f1de0e98f7f1	2	menerapkan metode numerik untuk menyelesaikan persamaan nonlinear (bisection, Newton–Raphson) dan sistem persamaan linear (eliminasi Gauss, Gauss–Seidel, Jacobi) serta menganalisis ketepatannya. (CPL 01)	2025-12-18 01:05:13.256889	2025-12-18 01:05:13.256889	\N
dd1216aa-85c7-405c-902a-890959a75dc9	d8d56fdd-d996-40e4-bec0-f1de0e98f7f1	3	menggunakan metode interpolasi (Newton, Lagrange), regresi, dan pendekatan kurva untuk memodelkan data teknik serta mengevaluasi hasil pemodelan (CPL 04)	2025-12-18 01:05:13.257646	2025-12-18 01:05:13.257646	\N
261b2dc4-0a56-483d-bfe8-15dcd51ce84a	d8d56fdd-d996-40e4-bec0-f1de0e98f7f1	4	menghitung turunan dan integral secara numerik menggunakan metode finite difference, aturan trapezoid, Simpson, serta menerapkan metode ini dalam kasus teknik. (CPL 04)	2025-12-18 01:05:13.258374	2025-12-18 01:05:13.258374	\N
45ce5a5f-a6e6-40bc-9aa6-e39c6cf27f91	d8d56fdd-d996-40e4-bec0-f1de0e98f7f1	5	mengimplementasikan metode numerik menggunakan perangkat lunak atau bahasa pemrograman, mengolah data, serta menyajikan hasil analisis secara akurat (CPL 04)	2025-12-18 01:05:13.259083	2025-12-18 01:05:13.259083	\N
9f3abdf6-002a-4e7b-a710-0f5276432e33	4183f953-eef6-4b87-aee6-45e11688bf5b	1	Menjelaskan konsep kapasitas dukung tanah untuk pondasi dangkal dan dalam. (CPL 01)	2025-12-18 01:05:13.261315	2025-12-18 01:05:13.261315	\N
2faccf86-617e-4f41-a728-c94d4413fb93	4183f953-eef6-4b87-aee6-45e11688bf5b	2	Menganalisis kestabilan lereng alam dan buatan (CPL 05)	2025-12-18 01:05:13.262246	2025-12-18 01:05:13.262246	\N
2279a8fc-6e4f-4951-b8df-13272af96468	4183f953-eef6-4b87-aee6-45e11688bf5b	3	Menghitung tekanan tanah lateral untuk desain dinding penahan tanah (CPL 05)	2025-12-18 01:05:13.263024	2025-12-18 01:05:13.263024	\N
31efa56b-a1cc-4c24-a599-92550139d161	4183f953-eef6-4b87-aee6-45e11688bf5b	4	Merancang sistem pondasi sesuai kondisi tanah dan beban struktur (CPL 03)	2025-12-18 01:05:13.263763	2025-12-18 01:05:13.263763	\N
1e8961c4-d0ef-43fb-9bce-bcea1bd16bcd	4183f953-eef6-4b87-aee6-45e11688bf5b	5	Menyusun laporan teknis hasil analisis dan desain geoteknik (CPL 03)	2025-12-18 01:05:13.264599	2025-12-18 01:05:13.264599	\N
14eebfbc-e0b5-4f9b-9ba0-cd35861c0b41	ff24d36e-f875-4e17-8c7d-6cbc98e2e1b6	1	Menjelaskan prinsip dasar nilai waktu uang dan aplikasinya dalam proyek teknik (CPL 02)	2025-12-17 22:53:20.804855	2025-12-17 22:53:20.804855	2025-12-18 01:05:13.265962
581837fe-dc5a-4631-aea9-76763f9772d2	ff24d36e-f875-4e17-8c7d-6cbc98e2e1b6	2	Menganalisis kelayakan finansial suatu proyek dengan berbagai metode evaluasi (CPL 02)	2025-12-17 22:53:20.805454	2025-12-17 22:53:20.805454	2025-12-18 01:05:13.265962
3d4b3b17-efa2-4838-af0b-822cfa5c1f46	ff24d36e-f875-4e17-8c7d-6cbc98e2e1b6	3	Menerapkan konsep depresiasi dan pengaruh inflasi dalam analisis ekonomi proyek (CPL 02)	2025-12-17 22:53:20.806236	2025-12-17 22:53:20.806236	2025-12-18 01:05:13.265962
e05d8474-9715-4a4f-ad03-90f2dabfb34d	ff24d36e-f875-4e17-8c7d-6cbc98e2e1b6	4	Merancang studi kelayakan sederhana untuk proyek sumber daya air (CPL 02)	2025-12-17 22:53:20.807039	2025-12-17 22:53:20.807039	2025-12-18 01:05:13.265962
a018b179-c2f5-44ee-9c78-94e6dc01092f	ff24d36e-f875-4e17-8c7d-6cbc98e2e1b6	5	Menyajikan hasil analisis ekonomi dalam bentuk presentasi yang sistematis (CPL 08)	2025-12-17 22:53:20.807748	2025-12-17 22:53:20.807748	2025-12-18 01:05:13.265962
9c9f5da7-bc81-4ed1-a98d-c66ca3629d06	ff24d36e-f875-4e17-8c7d-6cbc98e2e1b6	1	Menjelaskan prinsip dasar nilai waktu uang dan aplikasinya dalam proyek teknik (CPL 02)	2025-12-18 01:05:13.267084	2025-12-18 01:05:13.267084	\N
ca26c29a-06f5-46e2-bc9f-8cb50ec8a407	ff24d36e-f875-4e17-8c7d-6cbc98e2e1b6	2	Menganalisis kelayakan finansial suatu proyek dengan berbagai metode evaluasi (CPL 02)	2025-12-18 01:05:13.267885	2025-12-18 01:05:13.267885	\N
e7881e18-fea0-4efd-b5e7-93dde4378f04	ff24d36e-f875-4e17-8c7d-6cbc98e2e1b6	3	Menerapkan konsep depresiasi dan pengaruh inflasi dalam analisis ekonomi proyek (CPL 02)	2025-12-18 01:05:13.268634	2025-12-18 01:05:13.268634	\N
84a3050f-43d5-4340-94eb-1aaef891c2db	ff24d36e-f875-4e17-8c7d-6cbc98e2e1b6	4	Merancang studi kelayakan sederhana untuk proyek sumber daya air (CPL 02)	2025-12-18 01:05:13.269342	2025-12-18 01:05:13.269342	\N
5c6c9121-81b1-47b9-a7cb-611e1c7045b3	ff24d36e-f875-4e17-8c7d-6cbc98e2e1b6	5	Menyajikan hasil analisis ekonomi dalam bentuk presentasi yang sistematis (CPL 08)	2025-12-18 01:05:13.270082	2025-12-18 01:05:13.270082	\N
d6f14ddd-8cc2-4eff-ba15-0e71d0450d66	09b7406a-1a3f-4a71-a494-084a08f7e657	1	Menjelaskan prinsip dasar teknik lingkungan dan konsep pembangunan berkelanjutan (CPL 05)	2025-12-18 01:05:13.272007	2025-12-18 01:05:13.272007	\N
8dabc246-8092-4743-ab99-ef30363d7593	09b7406a-1a3f-4a71-a494-084a08f7e657	2	Menganalisis jenis dan sumber pencemaran air, udara, dan tanah (CPL 05)	2025-12-18 01:05:13.272737	2025-12-18 01:05:13.272737	\N
586d43fd-f686-4829-abbf-e40e940e5488	09b7406a-1a3f-4a71-a494-084a08f7e657	3	Mengenali prosedur dan komponen penyusunan dokumen AMDAL (CPL 05)	2025-12-18 01:05:13.273476	2025-12-18 01:05:13.273476	\N
97e28c07-54d3-4304-b85e-a1fe97164b65	09b7406a-1a3f-4a71-a494-084a08f7e657	4	Menyusun kajian dampak lingkungan awal dari suatu proyek SDA (CPL 09)	2025-12-18 01:05:13.274172	2025-12-18 01:05:13.274172	\N
647ab019-48ae-4885-a62f-155ffffbe275	09b7406a-1a3f-4a71-a494-084a08f7e657	5	Mempresentasikan hasil kajian AMDAL dan berdiskusi secara kritis (CPL 09)	2025-12-18 01:05:13.274905	2025-12-18 01:05:13.274905	\N
6374078f-de7e-44d4-badc-25a35d396e60	129e4398-9121-40a5-bd3c-8781a8da8cb9	1	Menjelaskan struktur atom, tabel periodik, dan ikatan kimia (CPL 01)	2025-12-18 01:05:13.276808	2025-12-18 01:05:13.276808	\N
ce20bfc5-1ea9-4443-b4ac-a7ddb23616dd	129e4398-9121-40a5-bd3c-8781a8da8cb9	2	Menghitung stoikiometri reaksi kimia (CPL 01)	2025-12-18 01:05:13.277817	2025-12-18 01:05:13.277817	\N
e89d9c29-1a6d-4ed2-8d8d-59c3c371b74a	129e4398-9121-40a5-bd3c-8781a8da8cb9	3	Menjelaskan sifat-sifat larutan dan konsentrasinya (CPL 01)	2025-12-18 01:05:13.2787	2025-12-18 01:05:13.2787	\N
988eb8ce-fba0-4172-b078-a98c7be9b0ec	129e4398-9121-40a5-bd3c-8781a8da8cb9	4	Menganalisis reaksi kimia yang terjadi di lingkungan perairan (CPL 05)	2025-12-18 01:05:13.279588	2025-12-18 01:05:13.279588	\N
f660248e-e939-48a9-bc65-e424f5935cc8	129e4398-9121-40a5-bd3c-8781a8da8cb9	5	Menerapkan konsep kimia dalam pengelolaan kualitas air (CPL 05)	2025-12-18 01:05:13.280368	2025-12-18 01:05:13.280368	\N
ab008f1f-6ac0-431c-a097-b2616273a567	42d307cb-2d3e-49ca-a8a3-de20dd7db04a	5	Menyusun laporan aplikasi perangkat lunak dan interpretasi hasil analisis. (CPL 05)	2025-12-17 22:53:20.822606	2025-12-17 22:53:20.822606	2025-12-18 01:05:13.281482
de8e30bc-13bd-4458-99b5-7a35b93376c9	42d307cb-2d3e-49ca-a8a3-de20dd7db04a	1	Menggunakan Microsoft Excel untuk pengolahan dan analisis data hidrologi. (CPL 01)	2025-12-18 01:05:13.2823	2025-12-18 01:05:13.2823	\N
be563bd0-7912-4e86-865d-e0486cb9ee0a	42d307cb-2d3e-49ca-a8a3-de20dd7db04a	2	Mengoperasikan AutoCAD untuk menggambar rancangan teknik sederhana. (CPL 01)	2025-12-18 01:05:13.282993	2025-12-18 01:05:13.282993	\N
468c180f-36eb-49e8-96e0-f80170a0c835	42d307cb-2d3e-49ca-a8a3-de20dd7db04a	3	Menerapkan QGIS untuk pengolahan data spasial dan pemetaan. (CPL 05)	2025-12-18 01:05:13.283691	2025-12-18 01:05:13.283691	\N
f5945dc5-5dbf-4a9a-9f5e-4400c780bd5e	42d307cb-2d3e-49ca-a8a3-de20dd7db04a	4	Menggunakan HEC-RAS untuk simulasi aliran sungai satu dimensi. (CPL 05)	2025-12-18 01:05:13.284353	2025-12-18 01:05:13.284353	\N
07124fb6-a1df-48b3-b1d8-210dbea5d769	42d307cb-2d3e-49ca-a8a3-de20dd7db04a	5	Menyusun laporan aplikasi perangkat lunak dan interpretasi hasil analisis. (CPL 05)	2025-12-18 01:05:13.285033	2025-12-18 01:05:13.285033	\N
0559509a-2efd-46a1-b102-9f8a3aa16147	4a7b4832-3288-4de6-81b4-059c176a97b4	5	Menyusun laporan studi lapangan tentang klasifikasi tanah dan tanaman dominan (CPL 01)	2025-12-17 22:53:20.827661	2025-12-17 22:53:20.827661	2025-12-18 01:05:13.285864
ce702b80-c281-4935-97f6-c00044612d47	4a7b4832-3288-4de6-81b4-059c176a97b4	1	Menjelaskan sifat fisik dan kimia tanah serta pengaruhnya terhadap pertumbuhan tanaman (CPL 01)	2025-12-18 01:05:13.286686	2025-12-18 01:05:13.286686	\N
a9bdf0cc-dde5-4fa9-bbbb-06c88bd2b1c2	4a7b4832-3288-4de6-81b4-059c176a97b4	2	Menganalisis kebutuhan air tanaman berdasarkan jenis tanaman dan fase pertumbuhannya (CPL 05)	2025-12-18 01:05:13.287322	2025-12-18 01:05:13.287322	\N
466a1dd7-b34d-4759-bfe6-bd764691ebc2	4a7b4832-3288-4de6-81b4-059c176a97b4	3	Menjelaskan interaksi antara tanah, air, dan tanaman dalam sistem pertanian (CPL 01)	2025-12-18 01:05:13.287988	2025-12-18 01:05:13.287988	\N
cd7811b5-bc67-45c3-b135-7fd63112004b	4a7b4832-3288-4de6-81b4-059c176a97b4	4	Mengidentifikasi teknik konservasi tanah dan air dalam pengelolaan lahan (CPL 03)	2025-12-18 01:05:13.288645	2025-12-18 01:05:13.288645	\N
50e8e1eb-a917-40a7-a72b-5860c9f0c97a	4a7b4832-3288-4de6-81b4-059c176a97b4	5	Menyusun laporan studi lapangan tentang klasifikasi tanah dan tanaman dominan (CPL 01)	2025-12-18 01:05:13.289397	2025-12-18 01:05:13.289397	\N
b3142dea-7c9c-4e2a-8968-f7cd6d66be53	a8bac38d-1b0b-4c86-afc0-efaf64845e3e	1	Menjelaskan sifat mekanik beton dan baja tulangan (CPL 02)	2025-12-18 01:05:13.291091	2025-12-18 01:05:13.291091	\N
69b58827-6cc1-46c0-82b7-f002b8f888af	a8bac38d-1b0b-4c86-afc0-efaf64845e3e	2	Menerapkan konsep tegangan-leleh dan beban izin dalam beton bertulang (CPL 05)	2025-12-18 01:05:13.291779	2025-12-18 01:05:13.291779	\N
7dda44e6-eb47-4d08-b0ed-5d9e744c31e6	a8bac38d-1b0b-4c86-afc0-efaf64845e3e	3	Menganalisis kekuatan lentur dan geser pada balok beton bertulang (CPL 05)	2025-12-18 01:05:13.292404	2025-12-18 01:05:13.292404	\N
970947fb-4669-423a-9605-3c88a92eeb8e	a8bac38d-1b0b-4c86-afc0-efaf64845e3e	4	Merancang balok beton satu bentang dengan beban merata (CPL 02)	2025-12-18 01:05:13.293054	2025-12-18 01:05:13.293054	\N
9af2d60f-ea14-474f-9e9b-6270218b1485	a8bac38d-1b0b-4c86-afc0-efaf64845e3e	5	Menyusun laporan desain dan perhitungan struktur beton sederhana (CPL 02)	2025-12-18 01:05:13.293944	2025-12-18 01:05:13.293944	\N
8153ba3c-acb5-42b9-b97c-c9d3a093b5a6	6d8fec6f-3844-452a-b2ce-113879e4ab18	1	Menjelaskan jenis dan karakteristik material serta profil struktur baja (CPL 02)	2025-12-18 01:05:13.296063	2025-12-18 01:05:13.296063	\N
8ec8b7e8-7845-4cf1-9696-76be24ca2c4a	6d8fec6f-3844-452a-b2ce-113879e4ab18	2	Menganalisis beban, gaya dalam, dan respons struktur baja sederhana (CPL 05)	2025-12-18 01:05:13.296818	2025-12-18 01:05:13.296818	\N
59186c5b-b576-4b6b-8247-78c7ca642224	6d8fec6f-3844-452a-b2ce-113879e4ab18	3	Merancang elemen struktur baja seperti balok, kolom, dan sambungan (CPL 05)	2025-12-18 01:05:13.297663	2025-12-18 01:05:13.297663	\N
80bcfce6-6666-469a-aaff-d0303d0c1475	6d8fec6f-3844-452a-b2ce-113879e4ab18	4	Mengevaluasi efisiensi dan keamanan desain struktur baja (CPL 05)	2025-12-18 01:05:13.298313	2025-12-18 01:05:13.298313	\N
45d3c74c-ce52-4a20-9cbb-98576c8dad92	6d8fec6f-3844-452a-b2ce-113879e4ab18	5	Mempresentasikan hasil desain struktur baja secara profesional (CPL 02)	2025-12-18 01:05:13.298997	2025-12-18 01:05:13.298997	\N
bcebd867-bf4e-4e18-8273-1a02a3a93a4f	7d9fd057-47d3-4ced-a74e-78ba889e6092	1	Menjelaskan tipe-tipe bendungan berdasarkan material dan fungsi (CPL 02)	2025-12-18 01:05:13.300603	2025-12-18 01:05:13.300603	\N
4ee5328b-607d-4188-875c-e430bb0cc552	7d9fd057-47d3-4ced-a74e-78ba889e6092	2	Menganalisis tahapan konstruksi bendungan tipe urugan (CPL 02)	2025-12-18 01:05:13.30134	2025-12-18 01:05:13.30134	\N
27757659-5495-4e93-9673-0c6ad262295d	7d9fd057-47d3-4ced-a74e-78ba889e6092	3	Menerapkan spesifikasi teknis dan peraturan dalam konstruksi bendungan (CPL 05)	2025-12-18 01:05:13.301968	2025-12-18 01:05:13.301968	\N
37c53ef2-0aa2-40c9-a5d0-91fc6ec441c8	7d9fd057-47d3-4ced-a74e-78ba889e6092	4	Merancang urutan pekerjaan konstruksi berdasarkan data teknis (CPL 02)	2025-12-18 01:05:13.302569	2025-12-18 01:05:13.302569	\N
e5d64209-4fb4-43ad-8115-5b76ce5c293e	7d9fd057-47d3-4ced-a74e-78ba889e6092	5	Menjelaskan aspek keselamatan konstruksi pada pembangunan bendungan (CPL 09)	2025-12-18 01:05:13.303183	2025-12-18 01:05:13.303183	\N
ff110c07-c1ed-4ae8-a85b-d645f0c24ddd	70fa1753-6c94-433b-8199-187402d9fecb	5	Menyusun laporan teknis dan mempresentasikan rencana pekerjaan pemindahan tanah (CPL 05)	2025-12-17 22:53:20.847627	2025-12-17 22:53:20.847627	2025-12-18 01:05:13.303963
eda38cdf-d130-4225-9798-80a08b101859	70fa1753-6c94-433b-8199-187402d9fecb	1	Menjelaskan jenis dan fungsi alat berat yang digunakan dalam pemindahan tanah (CPL 02)	2025-12-18 01:05:13.304856	2025-12-18 01:05:13.304856	\N
5ccd8dff-31ad-47cb-96a1-ed4ded503171	70fa1753-6c94-433b-8199-187402d9fecb	2	Menghitung produktivitas alat berat berdasarkan kondisi operasional di lapangan (CPL 05)	2025-12-18 01:05:13.30551	2025-12-18 01:05:13.30551	\N
5c1f1665-e2d6-40a4-b2d5-ab985a9a368e	70fa1753-6c94-433b-8199-187402d9fecb	3	Merancang perencanaan pekerjaan pemindahan tanah mekanis (CPL 02)	2025-12-18 01:05:13.306255	2025-12-18 01:05:13.306255	\N
27ed4bdd-3d36-4071-9f24-e3c55405414e	70fa1753-6c94-433b-8199-187402d9fecb	4	Menganalisis biaya operasional dan efisiensi alat berat (CPL 05)	2025-12-18 01:05:13.306963	2025-12-18 01:05:13.306963	\N
d386d453-52a8-4788-bfcd-7f2d42054bf1	70fa1753-6c94-433b-8199-187402d9fecb	5	Menyusun laporan teknis dan mempresentasikan rencana pekerjaan pemindahan tanah (CPL 05)	2025-12-18 01:05:13.307683	2025-12-18 01:05:13.307683	\N
1661812e-d6bc-4292-8f5e-54726be35db1	bee8f2a5-1a84-4395-8ccc-ba6d71a0db92	1	Menjelaskan konsep dasar manajemen air terpadu (IWRM) (CPL 07)	2025-12-18 01:05:13.309231	2025-12-18 01:05:13.309231	\N
b27eb293-adcd-487e-a49a-fea5df888ec2	bee8f2a5-1a84-4395-8ccc-ba6d71a0db92	2	Menganalisis tantangan dan strategi pengelolaan air di berbagai sektor (CPL 07)	2025-12-18 01:05:13.309974	2025-12-18 01:05:13.309974	\N
8ae3fc8d-d838-42f3-9156-a4702202a779	bee8f2a5-1a84-4395-8ccc-ba6d71a0db92	3	Menerapkan konsep konservasi dan efisiensi penggunaan air (CPL 07)	2025-12-18 01:05:13.311016	2025-12-18 01:05:13.311016	\N
1f6fcd76-84d9-499f-8316-1b48a615634a	bee8f2a5-1a84-4395-8ccc-ba6d71a0db92	4	Merancang sistem manajemen air berbasis DAS dan keterlibatan pemangku kepentingan (CPL 07)	2025-12-18 01:05:13.311759	2025-12-18 01:05:13.311759	\N
f8afdb46-7f38-4574-9428-d1d78cf6b3d7	bee8f2a5-1a84-4395-8ccc-ba6d71a0db92	5	Menyusun laporan dan mempresentasikan kebijakan dan strategi manajemen air (CPL 08)	2025-12-18 01:05:13.312489	2025-12-18 01:05:13.312489	\N
08b92e98-82ea-4caa-8b59-af8fe381477d	70f548a5-90e4-4563-b409-9a7ec2440e54	1	Menjelaskan prinsip dasar pengembangan sumber daya air terpadu (CPL 02)	2025-12-18 01:05:13.314189	2025-12-18 01:05:13.314189	\N
043b756c-8ed6-4d26-93a9-34a6f76b9ba5	70f548a5-90e4-4563-b409-9a7ec2440e54	2	Menganalisis potensi dan kebutuhan air pada suatu wilayah DAS. (CPL 02)	2025-12-18 01:05:13.314885	2025-12-18 01:05:13.314885	\N
135db2be-fb96-463a-8968-740b9e479446	70f548a5-90e4-4563-b409-9a7ec2440e54	3	Menerapkan konsep konservasi, pengendalian, dan pemanfaatan SDA. (CPL 02)	2025-12-18 01:05:13.315587	2025-12-18 01:05:13.315587	\N
31a5b570-5ea9-4295-a271-d922683f49ad	70f548a5-90e4-4563-b409-9a7ec2440e54	4	Merancang kerangka pengembangan SDA untuk multi sektor dan multipurpose. (CPL 02)	2025-12-18 01:05:13.316353	2025-12-18 01:05:13.316353	\N
a75a6221-109a-471e-b673-375e75f92a81	70f548a5-90e4-4563-b409-9a7ec2440e54	5	Menyusun laporan pengembangan dan kebijakan pengelolaan SDA. (CPL 08)	2025-12-18 01:05:13.316994	2025-12-18 01:05:13.316994	\N
35f44b50-50be-49ac-a03b-879c0d3acf9e	163ed239-5d48-46d7-8113-040dfc65cfdb	5	Menyusun laporan dan presentasi desain drainase kota yang berkelanjutan. (CPL 02)	2025-12-17 22:53:20.86213	2025-12-17 22:53:20.86213	2025-12-18 01:05:13.317984
a8e54e82-6f68-489c-bf7b-0e72d05aaf95	163ed239-5d48-46d7-8113-040dfc65cfdb	1	Menjelaskan konsep dan komponen sistem drainase perkotaan. (CPL 02)	2025-12-18 01:05:13.318601	2025-12-18 01:05:13.318601	\N
01e6a14e-a1c0-43c2-a0f4-9dccdad640ff	163ed239-5d48-46d7-8113-040dfc65cfdb	2	Menghitung debit limpasan permukaan menggunakan metode rasional dan hidrograf satuan. (CPL 05)	2025-12-18 01:05:13.31927	2025-12-18 01:05:13.31927	\N
8bbe85b3-af69-4362-a73d-343f09156262	163ed239-5d48-46d7-8113-040dfc65cfdb	3	Menganalisis kapasitas saluran dan kebutuhan struktur pengendali. (CPL 05)	2025-12-18 01:05:13.319923	2025-12-18 01:05:13.319923	\N
9a8c1981-fb18-4c63-8f54-e1184e8ddb49	163ed239-5d48-46d7-8113-040dfc65cfdb	4	Merancang sistem drainase perkotaan berbasis peta tata guna lahan. (CPL 02)	2025-12-18 01:05:13.320587	2025-12-18 01:05:13.320587	\N
855e5197-7d6f-4c86-a7fc-88652e1f6714	163ed239-5d48-46d7-8113-040dfc65cfdb	5	Menyusun laporan dan presentasi desain drainase kota yang berkelanjutan. (CPL 02)	2025-12-18 01:05:13.321345	2025-12-18 01:05:13.321345	\N
71aaad19-2871-4b94-b965-9e36771d353a	a6a068f7-84af-406c-936e-35e01daba2fa	1	Menjelaskan proses fisik di wilayah pantai (gelombang, arus, sedimentasi). (CPL 04)	2025-12-18 01:05:13.323127	2025-12-18 01:05:13.323127	\N
36190f27-8dca-4f5b-8366-97f96fda7557	a6a068f7-84af-406c-936e-35e01daba2fa	2	Menganalisis transport sedimen dan perubahan garis pantai. (CPL 04)	2025-12-18 01:05:13.323944	2025-12-18 01:05:13.323944	\N
3c1c5421-3069-4702-8119-f3fe408ad749	a6a068f7-84af-406c-936e-35e01daba2fa	3	Menerapkan konsep desain struktur pantai seperti groin, breakwater, dan revetment. (CPL 05)	2025-12-18 01:05:13.324768	2025-12-18 01:05:13.324768	\N
a935962b-c7dc-442e-9328-efc5b59c8d04	a6a068f7-84af-406c-936e-35e01daba2fa	4	Merancang sistem perlindungan pantai untuk kasus tertentu. (CPL 05)	2025-12-18 01:05:13.325586	2025-12-18 01:05:13.325586	\N
3ae3930d-0671-40f4-b49c-5866b41d4201	a6a068f7-84af-406c-936e-35e01daba2fa	5	Menyusun laporan teknis dan evaluasi dampak lingkungan dari intervensi pantai. (CPL 05)	2025-12-18 01:05:13.326417	2025-12-18 01:05:13.326417	\N
f2af73b8-cce6-46f4-8f86-a3320f222fcb	602674dd-a9fb-4c20-815d-567bfd023871	1	Menjelaskan prinsip kerja struktur beton bertulang untuk elemen kolom, pelat, dan tangga. (CPL 02)	2025-12-18 01:05:13.329319	2025-12-18 01:05:13.329319	\N
eb7b0de2-b3e1-47db-b03f-e6e16049441a	602674dd-a9fb-4c20-815d-567bfd023871	2	Menganalisis kapasitas struktur kolom, pelat dua arah, dan tangga beton bertulang. (CPL 02)	2025-12-18 01:05:13.330119	2025-12-18 01:05:13.330119	\N
1c9a4492-4693-430c-a3f1-0284232bb57b	602674dd-a9fb-4c20-815d-567bfd023871	3	Menerapkan konsep detailing penulangan pada struktur bertingkat. (CPL 05)	2025-12-18 01:05:13.330781	2025-12-18 01:05:13.330781	\N
6b1e0f17-4944-4402-b626-be3f062c566b	602674dd-a9fb-4c20-815d-567bfd023871	4	Merancang sistem struktur beton bertulang untuk bangunan sederhana tahan gempa. (CPL 02)	2025-12-18 01:05:13.331437	2025-12-18 01:05:13.331437	\N
8d903fe6-1f48-48e0-be63-b560e1d7ccb8	602674dd-a9fb-4c20-815d-567bfd023871	5	Menyusun laporan desain dan presentasi struktur beton kompleks. (CPL 02)	2025-12-18 01:05:13.332072	2025-12-18 01:05:13.332072	\N
bc341a15-6c27-4547-842e-1b462dab779c	2b2f7f62-3ce5-4a71-8dbd-504630479cdd	5	Menyusun laporan evaluasi hidraulika sungai dan perencanaan pengendalian. (CPL 02)	2025-12-17 22:53:20.876489	2025-12-17 22:53:20.876489	2025-12-18 01:05:13.332632
367eb36f-56fd-4578-94d8-ae7a46f23864	2b2f7f62-3ce5-4a71-8dbd-504630479cdd	1	Menjelaskan morfologi dan hidraulika sungai. (CPL 02)	2025-12-18 01:05:13.333683	2025-12-18 01:05:13.333683	\N
ea51a95a-ff46-49ee-babf-782919379876	2b2f7f62-3ce5-4a71-8dbd-504630479cdd	2	Menganalisis debit banjir dan penelusuran banjir menggunakan data historis. (CPL 05)	2025-12-18 01:05:13.334338	2025-12-18 01:05:13.334338	\N
dd05242c-d2a7-428a-ae7a-cc7e555d2155	2b2f7f62-3ce5-4a71-8dbd-504630479cdd	3	Menerapkan metode perbaikan alur sungai dan pengendalian banjir. (CPL 05)	2025-12-18 01:05:13.335029	2025-12-18 01:05:13.335029	\N
09e13451-ac8f-4260-a1b2-529aa1562493	2b2f7f62-3ce5-4a71-8dbd-504630479cdd	4	Merancang skema pengendalian banjir dan stabilisasi alur sungai. (CPL 02)	2025-12-18 01:05:13.335669	2025-12-18 01:05:13.335669	\N
c8dd1f75-5428-4268-9e47-4ea57021062c	2b2f7f62-3ce5-4a71-8dbd-504630479cdd	5	Menyusun laporan evaluasi hidraulika sungai dan perencanaan pengendalian. (CPL 02)	2025-12-18 01:05:13.336319	2025-12-18 01:05:13.336319	\N
56536cd9-39d3-40de-81f2-de129256b106	c92279ab-a524-4d4b-80fc-307220441dd8	1	Menjelaskan jenis dan fungsi pondasi pada bangunan air. (CPL 05)	2025-12-18 01:05:13.33801	2025-12-18 01:05:13.33801	\N
28ebd301-ab43-47c4-ba94-3159999d16a7	c92279ab-a524-4d4b-80fc-307220441dd8	2	Menganalisis daya dukung pondasi dangkal dan dalam. (CPL 05)	2025-12-18 01:05:13.338676	2025-12-18 01:05:13.338676	\N
2126a1c8-d944-4003-bdb1-9842419c204e	c92279ab-a524-4d4b-80fc-307220441dd8	3	Merancang sistem pondasi berdasarkan kondisi geoteknik. (CPL 03)	2025-12-18 01:05:13.339336	2025-12-18 01:05:13.339336	\N
973fe386-3873-4f5c-a80c-39056becaedc	c92279ab-a524-4d4b-80fc-307220441dd8	4	Mengidentifikasi potensi keruntuhan pondasi dari studi kasus. (CPL 03)	2025-12-18 01:05:13.340047	2025-12-18 01:05:13.340047	\N
e9650582-2959-4bf4-a80f-734bb62af661	c92279ab-a524-4d4b-80fc-307220441dd8	5	Menyusun laporan teknis evaluasi dan perencanaan pondasi. (CPL 03)	2025-12-18 01:05:13.340891	2025-12-18 01:05:13.340891	\N
509c8729-d0f4-4584-8015-3ac2af131430	76024a5f-2cb1-4b07-b7c5-7a2062915ca9	1	Menjelaskan prinsip dan ruang lingkup manajemen proyek konstruksi. (CPL 07)	2025-12-18 01:05:13.343408	2025-12-18 01:05:13.343408	\N
66456e35-5664-4dd6-8cbe-3ed07e186e44	76024a5f-2cb1-4b07-b7c5-7a2062915ca9	2	Menyusun jadwal proyek menggunakan metode CPM/PERT. (CPL 07)	2025-12-18 01:05:13.344682	2025-12-18 01:05:13.344682	\N
2066de55-d056-483c-9b30-dcfdb8b882f1	76024a5f-2cb1-4b07-b7c5-7a2062915ca9	3	Menghitung estimasi biaya proyek dan mengatur anggaran konstruksi. (CPL 07)	2025-12-18 01:05:13.345558	2025-12-18 01:05:13.345558	\N
086b07b1-7b67-4678-90c9-9e536d895d36	76024a5f-2cb1-4b07-b7c5-7a2062915ca9	4	Mengidentifikasi risiko dan strategi pengendalian proyek. (CPL 07)	2025-12-18 01:05:13.346399	2025-12-18 01:05:13.346399	\N
cfee2c0a-e991-40e1-8c03-8fa6e23f348a	76024a5f-2cb1-4b07-b7c5-7a2062915ca9	5	Menyusun laporan dan mempresentasikan hasil perencanaan proyek. (CPL 08)	2025-12-18 01:05:13.347152	2025-12-18 01:05:13.347152	\N
6c2f42ba-ed86-4a55-958b-13c13ecc0f71	17d5cde3-c3b3-4198-b57e-cb1a691add7b	5	Menyajikan dan mempertahankan proposal penelitian secara lisan. (CPL 03)	2025-12-17 22:53:20.890518	2025-12-17 22:53:20.890518	2025-12-18 01:05:13.348215
1b83e02a-02b8-4aed-b806-bdd0324e1138	17d5cde3-c3b3-4198-b57e-cb1a691add7b	1	Menjelaskan konsep dasar dan jenis-jenis pendekatan penelitian. (CPL 06)	2025-12-18 01:05:13.348928	2025-12-18 01:05:13.348928	\N
bd46b208-b14f-4bec-8c75-453ac12ec603	17d5cde3-c3b3-4198-b57e-cb1a691add7b	2	Merumuskan masalah dan tujuan penelitian yang relevan dengan teknik sumber daya air. (CPL 06)	2025-12-18 01:05:13.349605	2025-12-18 01:05:13.349605	\N
05693e30-498f-46c9-b8c6-094b89b0748a	17d5cde3-c3b3-4198-b57e-cb1a691add7b	3	Melakukan kajian literatur dan menyusun landasan teori. (CPL 06)	2025-12-18 01:05:13.350317	2025-12-18 01:05:13.350317	\N
caab57b3-3385-4072-8fd5-d88f1933b57b	17d5cde3-c3b3-4198-b57e-cb1a691add7b	4	Merancang metode penelitian dan teknik pengumpulan data. (CPL 03)	2025-12-18 01:05:13.35102	2025-12-18 01:05:13.35102	\N
2895c534-fd34-4bee-b73f-c65ab42fa1bf	17d5cde3-c3b3-4198-b57e-cb1a691add7b	5	Menyajikan dan mempertahankan proposal penelitian secara lisan. (CPL 03)	2025-12-18 01:05:13.351721	2025-12-18 01:05:13.351721	\N
8c8104c3-68f8-479b-8020-c2c3185d5618	2427f215-ba4c-404b-8dca-09c45f61eb06	4	menganalisis daya dukung pondasi dangkal dan pondasi dalam menggunakan teori Terzaghi, Meyerhof, atau Vesic, serta mempertimbangkan faktor keamanan, kondisi tanah, dan beban bangunan. (CPL 03)	2025-12-17 22:53:20.894385	2025-12-17 22:53:20.894385	2025-12-18 01:05:13.352722
94727b80-88c4-4211-bbad-90332fa4ade8	2427f215-ba4c-404b-8dca-09c45f61eb06	5	mengaplikasikan konsep mekanika tanah lanjutan dalam perencanaan struktur geoteknik (pondasi, galian, timbunan, dinding penahan) dengan memanfaatkan data hasil uji laboratorium dan lapangan (CPL 05)	2025-12-17 22:53:20.895186	2025-12-17 22:53:20.895186	2025-12-18 01:05:13.352722
7fc4f6d9-c69e-45d3-9bd4-26f678ecedf4	2427f215-ba4c-404b-8dca-09c45f61eb06	1	menjelaskan dan menganalisis sifat-sifat mekanis tanah lanjutan, termasuk kuat geser tanah, pemadatan, konsolidasi, serta perilaku tegangan–regangan tanah dalam berbagai kondisi pembebanan. (CPL 05)	2025-12-18 01:05:13.353397	2025-12-18 01:05:13.353397	\N
20b0dbb3-2f97-49af-bbf8-fbafa43992fd	2427f215-ba4c-404b-8dca-09c45f61eb06	2	menganalisis stabilitas lereng menggunakan metode keseimbangan batas (Fellenius, Bishop, Janbu) dan menentukan faktor keamanan pada berbagai kondisi geometri, jenis tanah, dan muka air tanah (CPL 03)	2025-12-18 01:05:13.354269	2025-12-18 01:05:13.354269	\N
b6115ddb-4a14-4969-8140-35413ccb8add	2427f215-ba4c-404b-8dca-09c45f61eb06	3	menghitung tekanan tanah aktif, pasif, dan keadaan diam menggunakan teori Rankine/Coulomb serta merancang dinding penahan tanah berdasarkan analisis stabilitas dan deformasi (CPL 03)	2025-12-18 01:05:13.354992	2025-12-18 01:05:13.354992	\N
67106bd7-a093-4191-bb01-bbb2fedcae15	2427f215-ba4c-404b-8dca-09c45f61eb06	4	menganalisis daya dukung pondasi dangkal dan pondasi dalam menggunakan teori Terzaghi, Meyerhof, atau Vesic, serta mempertimbangkan faktor keamanan, kondisi tanah, dan beban bangunan. (CPL 03)	2025-12-18 01:05:13.355669	2025-12-18 01:05:13.355669	\N
b898cc1f-07d1-4288-9b66-00524bec8d16	2427f215-ba4c-404b-8dca-09c45f61eb06	5	mengaplikasikan konsep mekanika tanah lanjutan dalam perencanaan struktur geoteknik (pondasi, galian, timbunan, dinding penahan) dengan memanfaatkan data hasil uji laboratorium dan lapangan (CPL 05)	2025-12-18 01:05:13.356476	2025-12-18 01:05:13.356476	\N
b6c3a5d6-fb96-46e3-999e-0c588abc5552	b6007f8f-a863-407d-94f2-76e1c0a2581f	3	Merancang sistem pemantauan keamanan bendungan berdasarkan data teknis.	2025-12-17 22:53:20.898663	2025-12-17 22:53:20.898663	2025-12-18 01:05:13.357303
477bffaa-7b71-4d28-977f-cfb915dea576	b6007f8f-a863-407d-94f2-76e1c0a2581f	4	Mengevaluasi fungsi dan pemeliharaan peralatan bendungan.	2025-12-17 22:53:20.899275	2025-12-17 22:53:20.899275	2025-12-18 01:05:13.357303
14a49c85-d0f1-4f9b-bada-621585aa7c33	b6007f8f-a863-407d-94f2-76e1c0a2581f	5	Menilai risiko kegagalan dan menyusun rencana mitigasi struktural.	2025-12-17 22:53:20.899984	2025-12-17 22:53:20.899984	2025-12-18 01:05:13.357303
76a0a5de-ccf5-445f-ae1d-8ed0d50a6a44	b6007f8f-a863-407d-94f2-76e1c0a2581f	1	Menganalisis sistem instrumentasi dan pemantauan bendungan.	2025-12-18 01:05:13.358233	2025-12-18 01:05:13.358233	\N
2dd9945a-eaef-49f6-9a34-de8821d1cb95	b6007f8f-a863-407d-94f2-76e1c0a2581f	2	Menerapkan metode evaluasi stabilitas bendungan pasca konstruksi.	2025-12-18 01:05:13.358903	2025-12-18 01:05:13.358903	\N
3ff4ba8b-aa14-4047-ac82-b864cde3806e	b6007f8f-a863-407d-94f2-76e1c0a2581f	3	Merancang sistem pemantauan keamanan bendungan berdasarkan data teknis.	2025-12-18 01:05:13.359627	2025-12-18 01:05:13.359627	\N
ff1ee452-6c86-4b90-8fc4-25445798db94	b6007f8f-a863-407d-94f2-76e1c0a2581f	4	Mengevaluasi fungsi dan pemeliharaan peralatan bendungan.	2025-12-18 01:05:13.360539	2025-12-18 01:05:13.360539	\N
0f17690a-df0a-428b-8843-35d9e9a6bc36	b6007f8f-a863-407d-94f2-76e1c0a2581f	5	Menilai risiko kegagalan dan menyusun rencana mitigasi struktural.	2025-12-18 01:05:13.361778	2025-12-18 01:05:13.361778	\N
b14f0145-9f06-41b7-abb9-7a2577a72354	d2247222-4d70-4793-8616-a87565de123c	5	Menyusun laporan hasil analisis dan desain pengelolaan sedimen. (CPL 02)	2025-12-17 22:53:20.904403	2025-12-17 22:53:20.904403	2025-12-18 01:05:13.363012
4b689af3-d526-4b3f-bc5c-48d25b812c4f	d2247222-4d70-4793-8616-a87565de123c	1	Menjelaskan konsep dasar transpor sedimen dan klasifikasi jenis sedimen. (CPL 05)	2025-12-18 01:05:13.363934	2025-12-18 01:05:13.363934	\N
89b845be-c608-43ac-b303-852ca93cd9ae	d2247222-4d70-4793-8616-a87565de123c	2	Menganalisis proses pengangkutan sedimen dan laju sedimentasi. (CPL 05)	2025-12-18 01:05:13.364624	2025-12-18 01:05:13.364624	\N
5602c0ba-b821-48f5-99d0-8ccdd2936eb0	d2247222-4d70-4793-8616-a87565de123c	3	Menerapkan hasil analisis sedimen dalam perencanaan pengendalian sedimentasi. (CPL 05)	2025-12-18 01:05:13.365239	2025-12-18 01:05:13.365239	\N
9c5f6c42-c61a-4224-9297-a1279bc03be0	d2247222-4d70-4793-8616-a87565de123c	4	Melakukan simulasi atau eksperimen sederhana terkait transpor sedimen. (CPL 02)	2025-12-18 01:05:13.365884	2025-12-18 01:05:13.365884	\N
2249776c-d6c5-4380-9245-b44c7838ac7c	d2247222-4d70-4793-8616-a87565de123c	5	Menyusun laporan hasil analisis dan desain pengelolaan sedimen. (CPL 02)	2025-12-18 01:05:13.366578	2025-12-18 01:05:13.366578	\N
fce9b306-38a8-4660-bcd2-c271edf5076c	913429ba-2d7b-427a-a910-a6613d4eea01	1	Menjelaskan jenis dan fungsi bangunan irigasi sekunder dan tersier. (CPL 02)	2025-12-18 01:05:13.368155	2025-12-18 01:05:13.368155	\N
857ad25d-eef9-418f-81c9-68c206b714af	913429ba-2d7b-427a-a910-a6613d4eea01	2	Menghitung kapasitas dan dimensi bangunan irigasi berdasarkan data hidrologi. (CPL 02)	2025-12-18 01:05:13.368865	2025-12-18 01:05:13.368865	\N
cf5adb93-cb05-4f11-9a0d-c0c3a76bbe1c	913429ba-2d7b-427a-a910-a6613d4eea01	3	Merancang bangunan irigasi secara teknis dan ekonomis. (CPL 02)	2025-12-18 01:05:13.369573	2025-12-18 01:05:13.369573	\N
ef98f61f-46ef-411b-a2ba-123da6ccf0e4	913429ba-2d7b-427a-a910-a6613d4eea01	4	Mengevaluasi kinerja bangunan irigasi eksisting di lapangan. (CPL 05)	2025-12-18 01:05:13.370248	2025-12-18 01:05:13.370248	\N
69321a90-d510-456b-840f-cdefb88f6577	913429ba-2d7b-427a-a910-a6613d4eea01	5	Mempresentasikan hasil perencanaan dan evaluasi bangunan irigasi. (CPL 05)	2025-12-18 01:05:13.370866	2025-12-18 01:05:13.370866	\N
ccb3bd71-fe34-4c17-bf10-ca2961c9af5c	c50c57e9-cc1c-496a-adba-ed79d52e9020	1	Menjelaskan klasifikasi dan fungsi jaringan irigasi.	2025-12-18 01:05:13.372541	2025-12-18 01:05:13.372541	\N
1a625f8f-8281-405e-8da1-34acd5cf9452	c50c57e9-cc1c-496a-adba-ed79d52e9020	2	Menghitung kebutuhan air irigasi berdasarkan data klimatologi dan tanaman.	2025-12-18 01:05:13.373205	2025-12-18 01:05:13.373205	\N
a8c8474d-f0f1-45bb-870b-766665c4549a	c50c57e9-cc1c-496a-adba-ed79d52e9020	3	Menganalisis kapasitas saluran irigasi dan debit desain.	2025-12-18 01:05:13.373855	2025-12-18 01:05:13.373855	\N
629a270b-e76e-4caf-8cbd-5fd4e913297d	c50c57e9-cc1c-496a-adba-ed79d52e9020	4	Merancang sistem jaringan irigasi dari intake hingga saluran tersier.	2025-12-18 01:05:13.374562	2025-12-18 01:05:13.374562	\N
114cbdb2-de91-4127-9bac-60a4fa5c4db7	c50c57e9-cc1c-496a-adba-ed79d52e9020	5	Menyusun laporan teknis dan presentasi desain jaringan irigasi.	2025-12-18 01:05:13.37528	2025-12-18 01:05:13.37528	\N
c6070c72-7c68-490e-bdc7-0b231dc841c9	d9506bc8-a306-4480-be16-e0b8a06fff61	5	Menyusun laporan teknis dan mempresentasikan desain bangunan pantai. (CPL 04)	2025-12-17 22:53:20.919012	2025-12-17 22:53:20.919012	2025-12-18 01:05:13.376434
d088a21b-811a-4740-bc0f-02fe3f87a3f2	d9506bc8-a306-4480-be16-e0b8a06fff61	1	Menjelaskan karakteristik proses pantai dan pengaruh gelombang laut terhadap garis pantai. (CPL 04)	2025-12-18 01:05:13.377562	2025-12-18 01:05:13.377562	\N
ca22e037-b6a0-49ea-bebc-4aa5599c45fd	d9506bc8-a306-4480-be16-e0b8a06fff61	2	Mengidentifikasi dan menjelaskan jenis bangunan pelindung pantai. (CPL 04)	2025-12-18 01:05:13.378525	2025-12-18 01:05:13.378525	\N
b70fe144-7355-46ca-9b34-59df5ccb7aa4	d9506bc8-a306-4480-be16-e0b8a06fff61	3	Merancang bangunan pantai berdasarkan kondisi gelombang dan garis pantai. (CPL 05)	2025-12-18 01:05:13.380074	2025-12-18 01:05:13.380074	\N
ae7951c6-81fe-4987-8dd2-8eaa86d7a909	d9506bc8-a306-4480-be16-e0b8a06fff61	4	Menganalisis proyek reklamasi dan dampaknya terhadap lingkungan pesisir. (CPL 04)	2025-12-18 01:05:13.380829	2025-12-18 01:05:13.380829	\N
ae865b39-b44e-47fb-a9da-8c83cf5674ce	d9506bc8-a306-4480-be16-e0b8a06fff61	5	Menyusun laporan teknis dan mempresentasikan desain bangunan pantai. (CPL 04)	2025-12-18 01:05:13.381536	2025-12-18 01:05:13.381536	\N
ecbe1630-0467-4240-ab22-998c5386dd68	bc629e61-ef3f-41a1-9958-73d5a2094ada	1	Menjelaskan konsep dasar hidrogeologi dan sistem akuifer. (CPL 02)	2025-12-18 01:05:13.383184	2025-12-18 01:05:13.383184	\N
df6d2f6c-e95c-4d4e-a6af-0adcbf9312e9	bc629e61-ef3f-41a1-9958-73d5a2094ada	2	Menganalisis parameter hidraulik dan keseimbangan air tanah. (CPL 02)	2025-12-18 01:05:13.383849	2025-12-18 01:05:13.383849	\N
5ea297c7-a707-44dd-9be9-6c14a17b8ec5	bc629e61-ef3f-41a1-9958-73d5a2094ada	3	Menerapkan metode pemetaan dan pemodelan aliran air tanah. (CPL 05)	2025-12-18 01:05:13.384491	2025-12-18 01:05:13.384491	\N
ac2803ae-ea15-4fe2-8890-6b9593b938c9	bc629e61-ef3f-41a1-9958-73d5a2094ada	4	Merancang strategi pengelolaan air tanah secara berkelanjutan. (CPL 02)	2025-12-18 01:05:13.385161	2025-12-18 01:05:13.385161	\N
1fed1b03-d903-4375-82ae-e8f7fa24b7d7	bc629e61-ef3f-41a1-9958-73d5a2094ada	5	Menyusun laporan teknis dan rekomendasi tata kelola air tanah. (CPL 02)	2025-12-18 01:05:13.38579	2025-12-18 01:05:13.38579	\N
d16d7505-c468-43fc-bcca-e682e7daffe6	7e8c1886-5348-4f66-987c-0b736b5fceab	1	Menjelaskan fungsi dan klasifikasi waduk berdasarkan tujuan dan skala. (CPL 02)	2025-12-18 01:05:13.387518	2025-12-18 01:05:13.387518	\N
ca1f7c07-3a96-4aaf-8875-175590cf2eea	7e8c1886-5348-4f66-987c-0b736b5fceab	2	Menghitung kapasitas tampungan dan volume efektif waduk. (CPL 07)	2025-12-18 01:05:13.388257	2025-12-18 01:05:13.388257	\N
9dcd4179-560f-4e48-a621-883f23f91e19	7e8c1886-5348-4f66-987c-0b736b5fceab	3	Menganalisis kebutuhan air tahunan dan fluktuasi debit masuk. (CPL 07)	2025-12-18 01:05:13.388955	2025-12-18 01:05:13.388955	\N
f687696d-3986-4a4f-8c10-54714d5b1a54	7e8c1886-5348-4f66-987c-0b736b5fceab	4	Merancang kurva operasi waduk untuk kebutuhan multipurpose. (CPL 02)	2025-12-18 01:05:13.38965	2025-12-18 01:05:13.38965	\N
ac55c33e-8ed6-4d60-acc2-a844ea1c491f	7e8c1886-5348-4f66-987c-0b736b5fceab	5	Mengevaluasi pengelolaan sedimentasi dan dampak lingkungan waduk. (CPL 07)	2025-12-18 01:05:13.390375	2025-12-18 01:05:13.390375	\N
e77a0fa8-d13b-46b1-b090-c80f295150b6	ebec4e67-a478-41c6-9605-fb24fb33d208	5	Menyusun laporan proyek PLTA dan mempresentasikan rencana kepada publik. (CPL 08)	2025-12-17 22:53:20.932499	2025-12-17 22:53:20.932499	2025-12-18 01:05:13.391254
01784336-4a01-4274-9d2b-09d67f8d7fd0	ebec4e67-a478-41c6-9605-fb24fb33d208	1	Menjelaskan konsep dasar dan klasifikasi pembangkit listrik tenaga air. (CPL 02)	2025-12-18 01:05:13.392185	2025-12-18 01:05:13.392185	\N
4ac7b92e-2a0b-4e05-b2a9-37b31ca22e0b	ebec4e67-a478-41c6-9605-fb24fb33d208	2	Menganalisis potensi energi air berdasarkan data hidrologi dan topografi. (CPL 02)	2025-12-18 01:05:13.392917	2025-12-18 01:05:13.392917	\N
ba8b938e-3ca2-4d53-af01-b919c2c04f38	ebec4e67-a478-41c6-9605-fb24fb33d208	3	Merancang sistem PLTA sederhana sesuai kondisi teknis dan lingkungan. (CPL 02)	2025-12-18 01:05:13.394001	2025-12-18 01:05:13.394001	\N
94b94e2f-6e54-4684-966e-4273faaf9402	ebec4e67-a478-41c6-9605-fb24fb33d208	4	Melakukan studi kelayakan teknis dan ekonomi sederhana. (CPL 02)	2025-12-18 01:05:13.395241	2025-12-18 01:05:13.395241	\N
039c7c15-ee54-4cf5-a473-aeffd7832825	ebec4e67-a478-41c6-9605-fb24fb33d208	5	Menyusun laporan proyek PLTA dan mempresentasikan rencana kepada publik. (CPL 08)	2025-12-18 01:05:13.396058	2025-12-18 01:05:13.396058	\N
6eb8e67e-9506-447d-9e74-e6739124a0c2	e4a4726b-acfe-414c-ad31-c9b5ca15d180	1	Menjelaskan klasifikasi jalan dan prinsip dasar perencanaan jalan raya. (CPL 02)	2025-12-18 01:05:13.397749	2025-12-18 01:05:13.397749	\N
abb94af4-6337-4540-bd99-9afdeac7ac35	e4a4726b-acfe-414c-ad31-c9b5ca15d180	2	Menganalisis elemen geometrik jalan seperti alinyemen horizontal dan vertikal. (CPL 02)	2025-12-18 01:05:13.398418	2025-12-18 01:05:13.398418	\N
37c19fef-36c3-4b92-b679-10bd1607666e	e4a4726b-acfe-414c-ad31-c9b5ca15d180	3	Menjelaskan jenis dan sifat material perkerasan jalan. (CPL 02)	2025-12-18 01:05:13.399086	2025-12-18 01:05:13.399086	\N
c51650c4-9669-4ab5-94f4-7d4e17dad34b	e4a4726b-acfe-414c-ad31-c9b5ca15d180	4	Merancang struktur perkerasan lentur dan kaku berdasarkan beban lalu lintas. (CPL 02)	2025-12-18 01:05:13.399775	2025-12-18 01:05:13.399775	\N
fc543978-7bba-417a-bf21-9121f554e35f	e4a4726b-acfe-414c-ad31-c9b5ca15d180	5	Menyajikan laporan teknis hasil perencanaan dan evaluasi jalan. (CPL 05)	2025-12-18 01:05:13.400439	2025-12-18 01:05:13.400439	\N
c5a6168e-b479-4551-9f45-a3624ebad047	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	1	Mengidentifikasi, menganalisis, dan merumuskan permasalahan teknis di bidang sumber daya air (irigasi, drainase, bangunan air, konservasi air, atau hidrologi terapan) berdasarkan kondisi nyata di lapangan secara sistematis dan berbasis data. (CPL 02)	2025-12-17 22:53:20.963513	2025-12-17 22:53:20.963513	2025-12-18 01:05:13.401405
18e769cf-259d-436c-b797-c50a5f878089	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	2	menyusun alternatif solusi dan rekomendasi teknis yang tepat dan aplikatif terhadap permasalahan pengairan di lokasi KKP, dengan mempertimbangkan aspek teknis, lingkungan, sosial, dan keberlanjutan (CPL 07)	2025-12-17 22:53:20.964357	2025-12-17 22:53:20.964357	2025-12-18 01:05:13.401405
6c44b6f1-ff02-4018-b014-2eb45af96653	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	3	menggunakan peralatan survei, instrumentsasi, software analisis/hidrolika/hidrologi, serta standar teknis (SNI, Permen, pedoman nasional) yang relevan dalam pelaksanaan kegiatan KKP (CPL 07)	2025-12-17 22:53:20.965033	2025-12-17 22:53:20.965033	2025-12-18 01:05:13.401405
08f5d445-2c5e-4f26-8311-e30b71a605f6	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	4	berkomunikasi secara efektif, bekerja dalam tim lintas disiplin, menunjukkan etika profesional, serta beradaptasi dengan budaya kerja instansi atau lembaga tempat pelaksanaan KKP (CPL 08)	2025-12-17 22:53:20.965714	2025-12-17 22:53:20.965714	2025-12-18 01:05:13.401405
0adba8b3-3325-404c-b446-c40cf3edb99f	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	5	menyusun laporan teknis KKP secara lengkap, logis, dan sesuai kaidah ilmiah, serta mempresentasikan hasil kegiatan kepada dosen pembimbing dan pihak instansi secara profesional (CPL 07)	2025-12-17 22:53:20.96641	2025-12-17 22:53:20.96641	2025-12-18 01:05:13.401405
4e3e7f6e-5002-4cf4-89de-f72b5cb4e966	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	6	Menginternalisasi dan menerapkan nilai-nilai Kemuhammadiyahan dalam kegiatan KKP melalui sikap amanah, kejujuran, kepedulian sosial, serta berkontribusi dalam kegiatan pengabdian masyarakat yang relevan dengan pengairan dan pemberdayaan lingkungan (CPL 07)	2025-12-17 22:53:20.967387	2025-12-17 22:53:20.967387	2025-12-18 01:05:13.401405
13fb7f0b-6b8f-4a96-81f4-cd7ad23c15df	e3dd615e-480b-44e7-9f81-12d050728519	4	Bekerja efektif dalam tim multidisiplin. (CPL 08)	2025-12-17 22:53:20.971815	2025-12-17 22:53:20.971815	2025-12-18 01:05:13.406958
e19b289f-dd9d-4369-9b09-acaa81c59d37	e3dd615e-480b-44e7-9f81-12d050728519	5	Menyajikan hasil proyek secara lisan dan tertulis dengan baik. (CPL 06)	2025-12-17 22:53:20.972524	2025-12-17 22:53:20.972524	2025-12-18 01:05:13.406958
e551743b-3ed5-40f3-b428-cc194ec2f299	e3dd615e-480b-44e7-9f81-12d050728519	6	Menunjukkan sikap profesional dan etis dalam proses perancangan. (CPL 09)	2025-12-17 22:53:20.973194	2025-12-17 22:53:20.973194	2025-12-18 01:05:13.406958
41d4ef92-d986-4869-b840-6b1ea1f2ea8b	e3dd615e-480b-44e7-9f81-12d050728519	7	Menunjukkan kesadaran terhadap pembelajaran sepanjang hayat. (CPL 10)	2025-12-17 22:53:20.97392	2025-12-17 22:53:20.97392	2025-12-18 01:05:13.406958
2b1a2684-842b-437f-aa2c-477fc4cf9f01	957683e2-4f71-4e02-b7eb-245d625ba14b	5	menyusun proposal penelitian secara lengkap, sistematis, dan sesuai kaidah ilmiah, termasuk format penulisan, struktur laporan, sitasi, dan etika akademik. (CPL 03)	2025-12-17 22:53:20.978614	2025-12-17 22:53:20.978614	2025-12-18 01:05:13.416624
44967b83-a008-4ecc-ad2e-dfdd14514c7d	957683e2-4f71-4e02-b7eb-245d625ba14b	6	mempresentasikan usulan penelitian secara efektif, menjawab pertanyaan dan argumen dari dosen/penilai secara kritis dan ilmiah, serta menunjukkan penguasaan substansi penelitian di bidang teknik pengairan (CPL 06)	2025-12-17 22:53:20.979515	2025-12-17 22:53:20.979515	2025-12-18 01:05:13.416624
b1a5fbea-f922-48bd-9f96-27705919e5c0	e3dd615e-480b-44e7-9f81-12d050728519	1	Mengintegrasikan pengetahuan dan keterampilan teknik pengairan untuk merancang proyek SDA. (CPL 04)	2025-12-18 01:05:13.407999	2025-12-18 01:05:13.407999	2025-12-18 01:05:13.442425
7904d575-adbc-4dd4-8bf5-13d034ebe2d8	e3dd615e-480b-44e7-9f81-12d050728519	2	Menerapkan prinsip rekayasa dalam pengembangan desain detail. (CPL 05)	2025-12-18 01:05:13.40863	2025-12-18 01:05:13.40863	2025-12-18 01:05:13.442425
667c5409-51b4-4706-8336-fc2e9ceca613	e3dd615e-480b-44e7-9f81-12d050728519	3	Mempertimbangkan aspek hukum, ekonomi, lingkungan, sosial, dan keselamatan. (CPL 02)	2025-12-18 01:05:13.409239	2025-12-18 01:05:13.409239	2025-12-18 01:05:13.442425
64246693-ad07-4a22-b150-5fc50aa58d48	e3dd615e-480b-44e7-9f81-12d050728519	4	Bekerja efektif dalam tim multidisiplin. (CPL 08)	2025-12-18 01:05:13.410148	2025-12-18 01:05:13.410148	2025-12-18 01:05:13.442425
dcf7f7ac-d1f1-484b-abaf-cf660ce62680	e3dd615e-480b-44e7-9f81-12d050728519	5	Menyajikan hasil proyek secara lisan dan tertulis dengan baik. (CPL 06)	2025-12-18 01:05:13.411508	2025-12-18 01:05:13.411508	2025-12-18 01:05:13.442425
2fe0295b-9a8f-4189-8390-3c960426f925	e3dd615e-480b-44e7-9f81-12d050728519	6	Menunjukkan sikap profesional dan etis dalam proses perancangan. (CPL 09)	2025-12-18 01:05:13.412601	2025-12-18 01:05:13.412601	2025-12-18 01:05:13.442425
42328bd2-6941-40df-9597-f6660626de04	e3dd615e-480b-44e7-9f81-12d050728519	7	Menunjukkan kesadaran terhadap pembelajaran sepanjang hayat. (CPL 10)	2025-12-18 01:05:13.414788	2025-12-18 01:05:13.414788	2025-12-18 01:05:13.442425
5e9e7b3b-2ad0-4203-a922-8cd62ded47a2	957683e2-4f71-4e02-b7eb-245d625ba14b	1	merumuskan latar belakang, ruang lingkup, dan identifikasi masalah penelitian secara sistematis dan didukung data atau fenomena relevan di bidang teknik pengairan. (CPL 03)	2025-12-18 01:05:13.419186	2025-12-18 01:05:13.419186	2025-12-18 01:05:13.451546
13d8f2e1-f854-4bb3-958b-ecf30f11f250	957683e2-4f71-4e02-b7eb-245d625ba14b	2	menyusun rumusan masalah, tujuan penelitian, batasan penelitian, serta manfaat penelitian secara jelas, logis, dan terukur (CPL 03)	2025-12-18 01:05:13.420359	2025-12-18 01:05:13.420359	2025-12-18 01:05:13.451546
be0c82b6-675c-42d1-83aa-0a65f36fa896	957683e2-4f71-4e02-b7eb-245d625ba14b	3	mengumpulkan, menelaah, dan menyintesis literatur ilmiah (jurnal, SNI, pedoman teknis, buku referensi) untuk mendukung konsep, teori, dan metodologi yang digunakan dalam usulan penelitian (CPL 03)	2025-12-18 01:05:13.421887	2025-12-18 01:05:13.421887	2025-12-18 01:05:13.451546
1efbbe5b-595a-4d20-b9d2-fa0f8a7b4a7b	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	1	Mengidentifikasi, menganalisis, dan merumuskan permasalahan teknis di bidang sumber daya air (irigasi, drainase, bangunan air, konservasi air, atau hidrologi terapan) berdasarkan kondisi nyata di lapangan secara sistematis dan berbasis data. (CPL 02)	2025-12-18 01:05:13.402637	2025-12-18 01:05:13.402637	2025-12-18 01:05:13.436202
032880a7-2baa-42c5-870b-17e94fa9607f	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	2	menyusun alternatif solusi dan rekomendasi teknis yang tepat dan aplikatif terhadap permasalahan pengairan di lokasi KKP, dengan mempertimbangkan aspek teknis, lingkungan, sosial, dan keberlanjutan (CPL 07)	2025-12-18 01:05:13.403406	2025-12-18 01:05:13.403406	2025-12-18 01:05:13.436202
5e5233a6-a1da-4425-ab99-19c21037ada3	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	3	menggunakan peralatan survei, instrumentsasi, software analisis/hidrolika/hidrologi, serta standar teknis (SNI, Permen, pedoman nasional) yang relevan dalam pelaksanaan kegiatan KKP (CPL 07)	2025-12-18 01:05:13.404126	2025-12-18 01:05:13.404126	2025-12-18 01:05:13.436202
0d98fa9f-76aa-4bce-b165-f5762e8eff33	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	4	berkomunikasi secara efektif, bekerja dalam tim lintas disiplin, menunjukkan etika profesional, serta beradaptasi dengan budaya kerja instansi atau lembaga tempat pelaksanaan KKP (CPL 08)	2025-12-18 01:05:13.40478	2025-12-18 01:05:13.40478	2025-12-18 01:05:13.436202
bcaa3a68-e3d2-4aa9-a501-b0cdebe6db82	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	5	menyusun laporan teknis KKP secara lengkap, logis, dan sesuai kaidah ilmiah, serta mempresentasikan hasil kegiatan kepada dosen pembimbing dan pihak instansi secara profesional (CPL 07)	2025-12-18 01:05:13.405648	2025-12-18 01:05:13.405648	2025-12-18 01:05:13.436202
5e5a8fd9-3f68-4f40-a2f9-3ac33565abd2	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	6	Menginternalisasi dan menerapkan nilai-nilai Kemuhammadiyahan dalam kegiatan KKP melalui sikap amanah, kejujuran, kepedulian sosial, serta berkontribusi dalam kegiatan pengabdian masyarakat yang relevan dengan pengairan dan pemberdayaan lingkungan (CPL 07)	2025-12-18 01:05:13.406381	2025-12-18 01:05:13.406381	2025-12-18 01:05:13.436202
40359e8d-2a68-4815-a6b6-ae0cfbbd98e9	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	1	Mengidentifikasi, menganalisis, dan merumuskan permasalahan teknis di bidang sumber daya air (irigasi, drainase, bangunan air, konservasi air, atau hidrologi terapan) berdasarkan kondisi nyata di lapangan secara sistematis dan berbasis data. (CPL 02)	2025-12-18 01:05:13.437117	2025-12-18 01:05:13.437117	\N
92dc4001-8461-4637-85ab-4be0efd0d375	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	2	menyusun alternatif solusi dan rekomendasi teknis yang tepat dan aplikatif terhadap permasalahan pengairan di lokasi KKP, dengan mempertimbangkan aspek teknis, lingkungan, sosial, dan keberlanjutan (CPL 07)	2025-12-18 01:05:13.438057	2025-12-18 01:05:13.438057	\N
3253a839-4b58-4bb6-a78b-5d73fe4c7570	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	3	menggunakan peralatan survei, instrumentsasi, software analisis/hidrolika/hidrologi, serta standar teknis (SNI, Permen, pedoman nasional) yang relevan dalam pelaksanaan kegiatan KKP (CPL 07)	2025-12-18 01:05:13.438948	2025-12-18 01:05:13.438948	\N
9b0b2dc9-1702-4b5d-a81e-f254bedf8feb	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	4	berkomunikasi secara efektif, bekerja dalam tim lintas disiplin, menunjukkan etika profesional, serta beradaptasi dengan budaya kerja instansi atau lembaga tempat pelaksanaan KKP (CPL 08)	2025-12-18 01:05:13.439846	2025-12-18 01:05:13.439846	\N
516c81b3-caa5-4df9-8959-774e638eeeba	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	5	menyusun laporan teknis KKP secara lengkap, logis, dan sesuai kaidah ilmiah, serta mempresentasikan hasil kegiatan kepada dosen pembimbing dan pihak instansi secara profesional (CPL 07)	2025-12-18 01:05:13.440676	2025-12-18 01:05:13.440676	\N
76f7c241-4ef6-4870-87ee-927a037d1846	1dfc722a-274f-426d-b4a5-f8bef0eb62b9	6	Menginternalisasi dan menerapkan nilai-nilai Kemuhammadiyahan dalam kegiatan KKP melalui sikap amanah, kejujuran, kepedulian sosial, serta berkontribusi dalam kegiatan pengabdian masyarakat yang relevan dengan pengairan dan pemberdayaan lingkungan (CPL 07)	2025-12-18 01:05:13.441583	2025-12-18 01:05:13.441583	\N
91bcdf29-b872-42a2-9e9b-98d46bb790be	e3dd615e-480b-44e7-9f81-12d050728519	1	Mengintegrasikan pengetahuan dan keterampilan teknik pengairan untuk merancang proyek SDA. (CPL 04)	2025-12-18 01:05:13.44439	2025-12-18 01:05:13.44439	\N
da32d887-7b7f-4ef4-b1c0-e545433d8bb7	e3dd615e-480b-44e7-9f81-12d050728519	2	Menerapkan prinsip rekayasa dalam pengembangan desain detail. (CPL 05)	2025-12-18 01:05:13.445693	2025-12-18 01:05:13.445693	\N
64637e1b-2f93-448a-b278-4d1c0daca445	e3dd615e-480b-44e7-9f81-12d050728519	3	Mempertimbangkan aspek hukum, ekonomi, lingkungan, sosial, dan keselamatan. (CPL 02)	2025-12-18 01:05:13.446704	2025-12-18 01:05:13.446704	\N
2d9b26aa-a3e3-4830-9ef8-3f63d0812c68	e3dd615e-480b-44e7-9f81-12d050728519	4	Bekerja efektif dalam tim multidisiplin. (CPL 08)	2025-12-18 01:05:13.447647	2025-12-18 01:05:13.447647	\N
58404a41-45f7-451e-8ecb-ebf426a0d187	e3dd615e-480b-44e7-9f81-12d050728519	5	Menyajikan hasil proyek secara lisan dan tertulis dengan baik. (CPL 06)	2025-12-18 01:05:13.448519	2025-12-18 01:05:13.448519	\N
66f49d56-aaaf-49f9-8801-45200ab75d53	e3dd615e-480b-44e7-9f81-12d050728519	6	Menunjukkan sikap profesional dan etis dalam proses perancangan. (CPL 09)	2025-12-18 01:05:13.449389	2025-12-18 01:05:13.449389	\N
74695e35-f007-4bf5-86e1-f2b1c4513b87	e3dd615e-480b-44e7-9f81-12d050728519	7	Menunjukkan kesadaran terhadap pembelajaran sepanjang hayat. (CPL 10)	2025-12-18 01:05:13.450245	2025-12-18 01:05:13.450245	\N
820f7e5f-fdba-4462-9815-5f690ae5f2b8	957683e2-4f71-4e02-b7eb-245d625ba14b	4	menyusun metodologi penelitian yang tepat dan relevan, termasuk metode pengumpulan data, teknik analisis hidrologi/hidrolika/sumber daya air, serta perencanaan alat dan perangkat lunak yang akan digunakan (CPL 03)	2025-12-18 01:05:13.422763	2025-12-18 01:05:13.422763	2025-12-18 01:05:13.451546
db29d6ed-66a8-484f-9ae9-df88a7be31f0	957683e2-4f71-4e02-b7eb-245d625ba14b	5	menyusun proposal penelitian secara lengkap, sistematis, dan sesuai kaidah ilmiah, termasuk format penulisan, struktur laporan, sitasi, dan etika akademik. (CPL 03)	2025-12-18 01:05:13.423712	2025-12-18 01:05:13.423712	2025-12-18 01:05:13.451546
b3aca881-edef-40cd-acb1-d89271b375db	957683e2-4f71-4e02-b7eb-245d625ba14b	6	mempresentasikan usulan penelitian secara efektif, menjawab pertanyaan dan argumen dari dosen/penilai secara kritis dan ilmiah, serta menunjukkan penguasaan substansi penelitian di bidang teknik pengairan (CPL 06)	2025-12-18 01:05:13.424529	2025-12-18 01:05:13.424529	2025-12-18 01:05:13.451546
e4836fc4-d6b6-4637-b816-f10d96d6c12a	957683e2-4f71-4e02-b7eb-245d625ba14b	1	merumuskan latar belakang, ruang lingkup, dan identifikasi masalah penelitian secara sistematis dan didukung data atau fenomena relevan di bidang teknik pengairan. (CPL 03)	2025-12-18 01:05:13.452378	2025-12-18 01:05:13.452378	\N
a1be00c1-5437-4da9-a386-c90fcd65a99d	957683e2-4f71-4e02-b7eb-245d625ba14b	2	menyusun rumusan masalah, tujuan penelitian, batasan penelitian, serta manfaat penelitian secara jelas, logis, dan terukur (CPL 03)	2025-12-18 01:05:13.453247	2025-12-18 01:05:13.453247	\N
af108942-32c9-4476-8b59-004b85118074	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	1	Merumuskan masalah penelitian yang relevan dengan bidang teknik sumber daya air. (CPL 04)	2025-12-18 01:05:13.426472	2025-12-18 01:05:13.426472	2025-12-18 01:05:13.458209
c53dd98f-4aba-448c-8f8c-7c9900d8cc4d	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	2	Melakukan kajian pustaka yang komprehensif. (CPL 04)	2025-12-18 01:05:13.429464	2025-12-18 01:05:13.429464	2025-12-18 01:05:13.458209
7096b81b-63ad-417d-969d-264a4379de56	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	3	Merancang metodologi penelitian yang sesuai. (CPL 05)	2025-12-18 01:05:13.430979	2025-12-18 01:05:13.430979	2025-12-18 01:05:13.458209
52128009-fbcf-4131-a345-153b9c0aa29a	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	4	Mengumpulkan dan menganalisis data penelitian. (CPL 03)	2025-12-18 01:05:13.432278	2025-12-18 01:05:13.432278	2025-12-18 01:05:13.458209
26dbce82-ad8a-4e94-bd93-40d76cee1b95	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	5	Menyajikan hasil penelitian dalam bentuk laporan ilmiah. (CPL 03)	2025-12-18 01:05:13.43323	2025-12-18 01:05:13.43323	2025-12-18 01:05:13.458209
c53a5590-735e-419e-9991-437ca90a7983	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	6	Mempertahankan hasil penelitian di hadapan penguji. (CPL 06)	2025-12-18 01:05:13.43421	2025-12-18 01:05:13.43421	2025-12-18 01:05:13.458209
beebf817-3115-4c4d-8809-1e403d52fe92	957683e2-4f71-4e02-b7eb-245d625ba14b	3	mengumpulkan, menelaah, dan menyintesis literatur ilmiah (jurnal, SNI, pedoman teknis, buku referensi) untuk mendukung konsep, teori, dan metodologi yang digunakan dalam usulan penelitian (CPL 03)	2025-12-18 01:05:13.454105	2025-12-18 01:05:13.454105	\N
03fa8b1c-ba90-4b7d-aaf8-93945568921f	957683e2-4f71-4e02-b7eb-245d625ba14b	4	menyusun metodologi penelitian yang tepat dan relevan, termasuk metode pengumpulan data, teknik analisis hidrologi/hidrolika/sumber daya air, serta perencanaan alat dan perangkat lunak yang akan digunakan (CPL 03)	2025-12-18 01:05:13.455633	2025-12-18 01:05:13.455633	\N
0189ae1f-8ca1-4db0-9ce1-1759299a916d	957683e2-4f71-4e02-b7eb-245d625ba14b	5	menyusun proposal penelitian secara lengkap, sistematis, dan sesuai kaidah ilmiah, termasuk format penulisan, struktur laporan, sitasi, dan etika akademik. (CPL 03)	2025-12-18 01:05:13.456624	2025-12-18 01:05:13.456624	\N
2c4514fd-0dca-45e5-ada0-d2813737634a	957683e2-4f71-4e02-b7eb-245d625ba14b	6	mempresentasikan usulan penelitian secara efektif, menjawab pertanyaan dan argumen dari dosen/penilai secara kritis dan ilmiah, serta menunjukkan penguasaan substansi penelitian di bidang teknik pengairan (CPL 06)	2025-12-18 01:05:13.457409	2025-12-18 01:05:13.457409	\N
6c0aa7d6-9318-4c4e-a73c-fcb7fabd21d6	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	7	Menunjukkan sikap profesional, etis, dan mandiri dalam penelitian. (CPL 09)	2025-12-18 01:05:13.435104	2025-12-18 01:05:13.435104	2025-12-18 01:05:13.458209
af55225e-a2af-425c-90c6-554b822139fd	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	1	Merumuskan masalah penelitian yang relevan dengan bidang teknik sumber daya air. (CPL 04)	2025-12-18 01:05:13.459218	2025-12-18 01:05:13.459218	\N
52d29f92-eccf-49dc-ba68-38544b52423d	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	2	Melakukan kajian pustaka yang komprehensif. (CPL 04)	2025-12-18 01:05:13.460852	2025-12-18 01:05:13.460852	\N
df3ba1c8-0654-405c-a91a-ee8b053a0f43	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	3	Merancang metodologi penelitian yang sesuai. (CPL 05)	2025-12-18 01:05:13.462273	2025-12-18 01:05:13.462273	\N
3e57fa0b-a57d-437c-8044-7721430bac71	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	4	Mengumpulkan dan menganalisis data penelitian. (CPL 03)	2025-12-18 01:05:13.463048	2025-12-18 01:05:13.463048	\N
5992f79e-a0fe-426d-b93a-5ea1f84ee13f	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	5	Menyajikan hasil penelitian dalam bentuk laporan ilmiah. (CPL 03)	2025-12-18 01:05:13.463792	2025-12-18 01:05:13.463792	\N
5b03984c-5152-499c-8de9-a374e53a772c	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	6	Mempertahankan hasil penelitian di hadapan penguji. (CPL 06)	2025-12-18 01:05:13.464479	2025-12-18 01:05:13.464479	\N
01c0a8ea-5b2b-4352-b464-f26f39b0dea6	1bd809f2-76d8-42d6-8e0d-3a9d920bc081	7	Menunjukkan sikap profesional, etis, dan mandiri dalam penelitian. (CPL 09)	2025-12-18 01:05:13.465388	2025-12-18 01:05:13.465388	\N
1ae142a2-62f4-44de-b897-508e0d41eb45	20ee1278-a3ba-4e5a-8cdd-243629c31a56	2	membaca dan memahami teks bahasa Inggris umum, seperti artikel pendek, deskripsi, email, dan teks informatif, serta mengidentifikasi ide pokok, detail penting, dan makna kosakata dalam konteks (CPL 06)	2025-12-18 01:05:13.149359	2025-12-18 19:26:54.083698	\N
b7e58b9c-7922-4178-8e8b-1941ae40a244	20ee1278-a3ba-4e5a-8cdd-243629c31a56	3	menulis kalimat dan paragraf sederhana dalam bahasa Inggris secara jelas dan koheren (CPL 06)	2025-12-18 01:05:13.150341	2025-12-18 19:26:54.088948	\N
d185fa54-9793-47d5-8e40-b82b7ff26505	20ee1278-a3ba-4e5a-8cdd-243629c31a56	4	berbicara dan berinteraksi dalam bahasa Inggris pada situasi sehari-hari, memperkenalkan diri, memberikan pendapat sederhana, berdiskusi dalam kelompok kecil, dan menyampaikan informasi dasar dengan pelafalan yang dapat dipahami (CPL 10)	2025-12-18 01:05:13.151174	2025-12-18 19:26:54.092142	\N
\.


--
-- Data for Name: dosen_courses; Type: TABLE DATA; Schema: public; Owner: smart_rps_user
--

COPY public.dosen_courses (dosen_id, course_id) FROM stdin;
\.


--
-- Data for Name: dosen_rps_access; Type: TABLE DATA; Schema: public; Owner: smart_rps_user
--

COPY public.dosen_rps_access (id, dosen_id, generated_rps_id, access_level, granted_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: dosen_rps_accesses; Type: TABLE DATA; Schema: public; Owner: smart_rps_user
--

COPY public.dosen_rps_accesses (id, dosen_id, generated_rps_id, access_level, granted_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: dosens; Type: TABLE DATA; Schema: public; Owner: smart_rps_user
--

COPY public.dosens (id, user_id, prodi_id, n_id_n, nama_lengkap, email, no_telepon, jabatan_fungsional, is_active, created_at, updated_at, deleted_at) FROM stdin;
af1b8fd5-d6a3-485d-801f-9d3450bce62d	ebbe3ce3-a2ec-4ea1-afd5-7579e7278f4f	cf1f1218-e4f2-4020-b320-70d70b62c8ab	93229492	galang	andiariegalang@gmail.com	09890980	lektor	t	2025-12-07 01:59:45.215007+08	2025-12-17 17:47:04.173398+08	2025-12-17 17:55:55.904907+08
\.


--
-- Data for Name: generated_rps; Type: TABLE DATA; Schema: public; Owner: smart_rps_user
--

COPY public.generated_rps (id, template_version_id, course_id, generated_by, status, result, exported_file_url, ai_metadata, created_at, updated_at, deleted_at) FROM stdin;
8978c998-0869-4b13-9d55-38ba6aa37a15	\N	8c7b796e-6bf7-4f51-b8fd-f5831900298b	\N	completed	{"cpmk": [{"code": "CPMK-1", "order": 1, "description": "Menjelaskan konsep limit dan kontinuitas fungsi satu variabel. (CPL 01)", "selected_cpls": ["CPL-01"]}, {"code": "CPMK-2", "order": 2, "description": "Menerapkan aturan turunan dalam menyelesaikan persoalan teknik. CPL 01)", "selected_cpls": ["CPL-01", "CPL-04"]}, {"code": "CPMK-3", "order": 3, "description": "Menganalisis grafik fungsi menggunakan turunan pertama dan kedua. (CPL 04)", "selected_cpls": ["CPL-04", "CPL-01", "CPL-03"]}, {"code": "CPMK-4", "order": 4, "description": "Menghitung integral tak tentu dan tertentu dari fungsi polinomial. (CPL 04)", "selected_cpls": ["CPL-04", "CPL-01"]}, {"code": "CPMK-5", "order": 5, "description": "Menyusun model matematika sederhana (CPL 04)", "selected_cpls": ["CPL-04", "CPL-01", "CPL-05"]}], "course": {"id": "8c7b796e-6bf7-4f51-b8fd-f5831900298b", "code": "CW6220202301", "title": "Matematika I", "credits": 3, "semester": 1}, "subCpmk": [{"code": "Sub-CPMK-1", "order": 1, "description": "Mampu menghitung limit fungsi satu variabel menggunakan metode aljabar dan grafik.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-2", "order": 2, "description": "Mampu menjelaskan definisi limit fungsi dan menghitung limit fungsi sederhana.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-3", "order": 3, "description": "Mampu menghitung limit fungsi satu variabel menggunakan definisi epsilon-delta.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-4", "order": 4, "description": "Menghitung turunan fungsi polinomial dan menerapkannya dalam persoalan teknik sederhana.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-5", "order": 5, "description": "Mengidentifikasi dan menerapkan aturan turunan dasar (fungsi konstanta, fungsi pangkat) dalam persoalan teknik.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-6", "order": 6, "description": "Mampu menghitung turunan fungsi polinomial dan menerapkannya dalam persoalan teknik sederhana.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-7", "order": 7, "description": "Mengidentifikasi titik stasioner pada grafik fungsi dengan menggunakan turunan pertama.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-8", "order": 8, "description": "Mengidentifikasi dan menjelaskan sifat-sifat grafik fungsi berdasarkan nilai turunan pertama.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-9", "order": 9, "description": "Mengidentifikasi titik kritis dari fungsi menggunakan turunan pertama dan menentukan sifatnya.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-10", "order": 10, "description": "Menghitung integral tak tentu dari fungsi polinomial derajat satu dan dua.", "related_cpmk": "CPMK-4"}, {"code": "Sub-CPMK-11", "order": 11, "description": "Mengidentifikasi bentuk umum dari fungsi polinomial yang akan diintegrasi.", "related_cpmk": "CPMK-4"}, {"code": "Sub-CPMK-12", "order": 12, "description": "Mengidentifikasi dan menyelesaikan integral tak tentu dari fungsi polinomial derajat satu dan dua.", "related_cpmk": "CPMK-4"}, {"code": "Sub-CPMK-13", "order": 13, "description": "Mampu mengidentifikasi variabel dan parameter dalam suatu masalah nyata yang dapat dimodelkan secara matematis.", "related_cpmk": "CPMK-5"}, {"code": "Sub-CPMK-14", "order": 14, "description": "Mengidentifikasi variabel dan parameter dalam situasi nyata untuk membangun model matematika.", "related_cpmk": "CPMK-5"}], "deskripsi": "Mata kuliah Matematika I (CW6220202301) bertujuan untuk memberikan pemahaman dasar tentang konsep-konsep matematika yang fundamental dan aplikatif. Materi yang akan dibahas mencakup aljabar, fungsi, limit, dan konsep dasar kalkulus, serta penerapannya dalam berbagai konteks ilmiah dan teknik. Melalui pendekatan analitis dan praktis, mahasiswa diharapkan dapat mengembangkan kemampuan berpikir logis dan kritis dalam memecahkan masalah matematika. Manfaat dari mata kuliah ini sangat penting bagi mahasiswa dalam membangun fondasi yang kuat untuk mata kuliah lanjutan di bidang matematika serta disiplin ilmu lainnya, sehingga mendukung keberhasilan akademik dan profesional di masa depan.", "referensi": ["James Stewart. (2020). Calculus: Early Transcendentals. Cengage Learning [Buku]", "Michael Spivak. (2020). Calculus. Publish or Perish, Inc. [Buku]", "Serge Lang. (2021). A First Course in Calculus. Springer [Buku]", "Stephen Abbott. (2021). Understanding Analysis. Springer [Buku]", "Tom M. Apostol. (2021). Mathematical Analysis. Wiley [Buku]", "John Doe. (2022). Limit and Continuity of Functions: Applications in Engineering. International Journal of Engineering Mathematics [Jurnal]", "Jane Smith. (2023). The Role of Derivatives in Engineering Problems. Journal of Applied Mathematics [Jurnal]", "Mark Johnson. (2023). Integral Calculus Applications in Science and Engineering. Mathematics and Engineering Journal [Jurnal]", "Emily White. (2023). Modeling with Mathematics: A Practical Approach. Journal of Mathematical Modeling [Jurnal]", "Robert Brown. (2023). Advanced Calculus: Concepts and Applications. Academic Press [Buku]"], "bahanKajian": ["Topik 1: Pengantar Limit dan Kontinuitas - Memahami konsep limit fungsi satu variabel dan kondisi kontinuitas pada titik tertentu.", "Topik 2: Aturan Turunan - Menerapkan aturan dasar turunan dalam fungsi satu variabel untuk menyelesaikan persoalan teknik.", "Topik 3: Analisis Grafik dengan Turunan Pertama - Menggunakan turunan pertama untuk menentukan sifat-sifat grafik fungsi, seperti interval naik dan turun.", "Topik 4: Analisis Grafik dengan Turunan Kedua - Menggunakan turunan kedua untuk menentukan sifat kelengkungan grafik dan titik infleksi.", "Topik 5: Integral Tak Tentu - Menghitung integral tak tentu dari fungsi polinomial dan memahami konsep antiturunan.", "Topik 6: Integral Tentu - Menghitung integral tertentu dari fungsi polinomial dan menerapkan teorema dasar kalkulus.", "Topik 7: Model Matematika Sederhana - Menyusun dan menganalisis model matematika sederhana menggunakan fungsi, limit, dan turunan.", "Topik 8: Aplikasi Konsep Limit dan Turunan - Mengaitkan konsep limit dan turunan dalam aplikasi nyata di bidang teknik dan sains."], "rencanaTugas": [{"order": 1, "subCpmk": "Sub-CPMK-2", "tugasKe": 1, "indikator": "Mahasiswa mampu mampu menjelaskan definisi limit fungsi dan menghitung limit fungsi sederhana.", "batasWaktu": "Minggu ke-4", "judulTugas": "Tugas 1: Mampu menjelaskan definisi limit fungsi dan menghi...", "bobotPersen": "20%", "luaranTugas": "Laporan/dokumen terkait Sub-CPMK-2", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-2\\n- Kelengkapan isi\\n- Kerapihan dan sistematika\\n- Ketepatan waktu pengumpulan", "petunjukPengerjaan": "Mata kuliah ini bertujuan untuk memberikan pemahaman dasar mengenai konsep limit fungsi dalam kalkulus. Mahasiswa akan diperkenalkan pada definisi limit, baik dari sudut pandang intuitif maupun formal, serta teknik-teknik dasar dalam menghitung limit fungsi sederhana. Materi yang dibahas mencakup sifat-sifat limit, jenis-jenis limit, serta penerapan limit dalam konteks fungsi kontinu dan diskontinu. Melalui mata kuliah ini, mahasiswa diharapkan mampu mengembangkan kemampuan analitis dalam menyel"}, {"order": 2, "subCpmk": "Sub-CPMK-7", "tugasKe": 2, "indikator": "Mahasiswa mampu mengidentifikasi titik stasioner pada grafik fungsi dengan menggunakan turunan pertama.", "batasWaktu": "Minggu ke-8", "judulTugas": "Tugas 2: Mengidentifikasi titik stasioner pada grafik fungs...", "bobotPersen": "25%", "luaranTugas": "Laporan/dokumen terkait Sub-CPMK-7", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-7\\n- Kelengkapan isi\\n- Kerapihan dan sistematika\\n- Ketepatan waktu pengumpulan", "petunjukPengerjaan": "Mata kuliah Tugas 2 - Mengidentifikasi titik stasioner pada grafik fungsi dengan menggunakan turunan pertama bertujuan untuk memberikan pemahaman mendalam mengenai konsep dan aplikasi turunan dalam analisis fungsi. Materi yang akan dibahas mencakup pengertian titik stasioner, metode penghitungan turunan pertama, serta teknik untuk menentukan sifat dari titik stasioner tersebut. Melalui praktikum dan studi kasus, mahasiswa akan dilatih untuk menganalisis grafik fungsi dan mengidentifikasi titik m"}, {"order": 3, "subCpmk": "Sub-CPMK-10", "tugasKe": 3, "indikator": "Mahasiswa mampu menghitung integral tak tentu dari fungsi polinomial derajat satu dan dua.", "batasWaktu": "Minggu ke-12", "judulTugas": "Tugas 3: Menghitung integral tak tentu dari fungsi polinomi...", "bobotPersen": "30%", "luaranTugas": "Laporan/dokumen terkait Sub-CPMK-10", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-10\\n- Kelengkapan isi\\n- Kerapihan dan sistematika\\n- Ketepatan waktu pengumpulan", "petunjukPengerjaan": "Mata kuliah Tugas 3 - Menghitung integral tak tentu dari fungsi polinomial derajat satu dan dua bertujuan untuk memberikan pemahaman mendalam mengenai konsep integral dalam kalkulus, khususnya terkait dengan fungsi polinomial. Materi yang akan dibahas mencakup teknik penghitungan integral tak tentu, aplikasi sifat-sifat integral, serta penerapan dalam konteks fungsi polinomial derajat satu dan dua. Melalui mata kuliah ini, mahasiswa diharapkan dapat menguasai keterampilan menghitung integral den"}], "rencanaMingguan": [{"materi": "Pengantar Limit dan Kontinuitas - Memahami konsep limit fungsi satu variabel dan kondisi kontinuitas pada titik tertentu.", "metode": "Ceramah, Diskusi", "minggu": 1, "subCpmk": "Sub-CPMK-1", "penilaian": "Quiz"}, {"materi": "Definisi limit fungsi dan menghitung limit fungsi sederhana.", "metode": "Praktikum", "minggu": 2, "subCpmk": "Sub-CPMK-2", "penilaian": "Tugas"}, {"materi": "Menghitung limit fungsi satu variabel menggunakan definisi epsilon-delta.", "metode": "Ceramah, Diskusi", "minggu": 3, "subCpmk": "Sub-CPMK-3", "penilaian": "Quiz"}, {"materi": "Menghitung turunan fungsi polinomial dan menerapkannya dalam persoalan teknik sederhana.", "metode": "Praktikum", "minggu": 4, "subCpmk": "Sub-CPMK-4", "penilaian": "Tugas"}, {"materi": "Identifikasi dan penerapan aturan turunan dasar dalam persoalan teknik.", "metode": "Ceramah, Diskusi", "minggu": 5, "subCpmk": "Sub-CPMK-5", "penilaian": "Quiz"}, {"materi": "Menghitung turunan fungsi polinomial dan menerapkannya dalam persoalan teknik sederhana.", "metode": "Praktikum", "minggu": 6, "subCpmk": "Sub-CPMK-6", "penilaian": "Tugas"}, {"materi": "Identifikasi titik stasioner pada grafik fungsi dengan menggunakan turunan pertama.", "metode": "Ceramah, Diskusi", "minggu": 7, "subCpmk": "Sub-CPMK-7", "penilaian": "Quiz"}, {"materi": "Menggunakan turunan pertama untuk menentukan sifat-sifat grafik fungsi, seperti interval naik dan turun.", "metode": "Praktikum", "minggu": 9, "subCpmk": "Sub-CPMK-8", "penilaian": "Tugas"}, {"materi": "Identifikasi titik kritis dari fungsi menggunakan turunan pertama dan menentukan sifatnya.", "metode": "Ceramah, Diskusi", "minggu": 10, "subCpmk": "Sub-CPMK-9", "penilaian": "Quiz"}, {"materi": "Menghitung integral tak tentu dari fungsi polinomial derajat satu dan dua.", "metode": "Praktikum", "minggu": 11, "subCpmk": "Sub-CPMK-10", "penilaian": "Tugas"}, {"materi": "Identifikasi bentuk umum dari fungsi polinomial yang akan diintegrasi.", "metode": "Ceramah, Diskusi", "minggu": 12, "subCpmk": "Sub-CPMK-11", "penilaian": "Quiz"}, {"materi": "Menyelesaikan integral tak tentu dari fungsi polinomial derajat satu dan dua.", "metode": "Praktikum", "minggu": 13, "subCpmk": "Sub-CPMK-12", "penilaian": "Tugas"}, {"materi": "Identifikasi variabel dan parameter dalam suatu masalah nyata yang dapat dimodelkan secara matematis.", "metode": "Ceramah, Diskusi", "minggu": 14, "subCpmk": "Sub-CPMK-13", "penilaian": "Quiz"}]}	\N	\N	2025-12-18 08:46:27.561988+08	2025-12-18 11:53:01.89053+08	\N
56f2fc0e-86a4-43e8-9669-9d53f5010939	\N	a282cd65-55b7-46c5-9f6c-90cc3a10286f	\N	completed	{"cpmk": [{"code": "CPMK-1", "order": 1, "description": "Mahasiswa mampu menjelaskan nilai, prinsip, dan sistem etika Pancasila dalam kehidupan berbangsa dan bernegara. (CPL 09)", "selected_cpls": ["CPL-09", "CPL-10"]}, {"code": "CPMK-2", "order": 2, "description": "Mahasiswa mampu menganalisis persoalan sosial dan profesional menggunakan perspektif etika Pancasila. (CPL 08)", "selected_cpls": ["CPL-09", "CPL-10"]}, {"code": "CPMK-3", "order": 3, "description": "Mahasiswa mampu menunjukkan sikap integritas, moralitas, dan tanggung jawab sosial dalam aktivitas akademik. (CPL 09)", "selected_cpls": ["CPL-09", "CPL-10"]}, {"code": "CPMK-4", "order": 4, "description": "Mahasiswa mampu menerapkan nilai-nilai Pancasila sebagai dasar pengambilan keputusan yang adil dan berkeadilan sosial. (CPL 08)", "selected_cpls": ["CPL-02", "CPL-09"]}], "course": {"id": "a282cd65-55b7-46c5-9f6c-90cc3a10286f", "code": "AW60910042101", "title": "Pendidikan Pancasila", "credits": 2, "semester": 1}, "subCpmk": [{"code": "Sub-CPMK-1", "order": 1, "description": "Mahasiswa mampu mengidentifikasi dan menjelaskan lima nilai dasar Pancasila dalam konteks kehidupan sosial masyarakat.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-2", "order": 2, "description": "Mahasiswa mampu mendeskripsikan nilai-nilai dasar Pancasila dan implementasinya dalam kehidupan sehari-hari.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-3", "order": 3, "description": "Mahasiswa mampu mengidentifikasi dan menjelaskan nilai-nilai dasar Pancasila dalam konteks kehidupan sehari-hari.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-4", "order": 4, "description": "Mahasiswa mampu mengidentifikasi dan menjelaskan lima nilai utama Pancasila serta relevansinya dalam kehidupan sehari-hari.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-5", "order": 5, "description": "Mahasiswa mampu mengidentifikasi dan mendeskripsikan persoalan sosial yang relevan dengan prinsip etika Pancasila dalam konteks masyarakat saat ini.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-6", "order": 6, "description": "Mahasiswa dapat mengidentifikasi dan menjelaskan persoalan sosial yang relevan dengan nilai-nilai Pancasila.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-7", "order": 7, "description": "Mahasiswa dapat mengidentifikasi dan mendeskripsikan persoalan sosial yang relevan dengan nilai-nilai Pancasila.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-8", "order": 8, "description": "Mahasiswa mampu mengidentifikasi dan merumuskan persoalan sosial yang relevan dengan nilai-nilai Pancasila.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-9", "order": 9, "description": "Mahasiswa mampu mengidentifikasi dan menjelaskan nilai-nilai Pancasila yang berhubungan dengan integritas dan moralitas dalam kehidupan sehari-hari.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-10", "order": 10, "description": "Mahasiswa dapat menjelaskan konsep integritas dan moralitas dalam konteks Pancasila dan aplikasinya dalam kehidupan sehari-hari.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-11", "order": 11, "description": "Mahasiswa dapat menjelaskan konsep integritas dan moralitas dalam konteks Pancasila secara tertulis.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-12", "order": 12, "description": "Mahasiswa dapat menjelaskan konsep integritas dan moralitas dalam konteks Pancasila dan penerapannya dalam kehidupan sehari-hari.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-13", "order": 13, "description": "Mahasiswa dapat mengidentifikasi dan menjelaskan nilai-nilai Pancasila yang relevan dalam situasi pengambilan keputusan.", "related_cpmk": "CPMK-4"}, {"code": "Sub-CPMK-14", "order": 14, "description": "Mahasiswa mampu mengidentifikasi dan menganalisis kasus-kasus pengambilan keputusan yang mencerminkan nilai-nilai Pancasila dalam konteks sosial dan ekonomi.", "related_cpmk": "CPMK-4"}], "deskripsi": "Mata kuliah Pendidikan Pancasila bertujuan untuk membekali mahasiswa dengan pemahaman mendalam mengenai nilai-nilai Pancasila sebagai dasar negara dan pandangan hidup bangsa Indonesia. Materi yang akan dipelajari mencakup sejarah, filosofi, dan implementasi Pancasila dalam berbagai aspek kehidupan sosial, politik, dan budaya. Selain itu, mata kuliah ini juga membahas peran Pancasila dalam membangun karakter bangsa, memperkuat integrasi sosial, serta menciptakan masyarakat yang adil dan makmur. Melalui pendidikan ini, diharapkan mahasiswa dapat menerapkan nilai-nilai Pancasila dalam kehidupan sehari-hari serta berkontribusi positif terhadap pembangunan bangsa.", "referensi": ["Sujana, A.. (2022). Pancasila: Dasar Negara dan Pandangan Hidup Bangsa. Rajawali Press [Buku]", "Hidayat, R.. (2021). Etika Pancasila dalam Pengambilan Keputusan. Gramedia Pustaka Utama [Buku]", "Sari, L.. (2023). Pendidikan Pancasila dan Karakter Bangsa. Alfabeta [Buku]", "Wibowo, T.. (2020). Tantangan Penerapan Pancasila di Era Globalisasi. Erlangga [Buku]", "Prasetyo, D.. (2023). Implementasi Nilai-Nilai Pancasila dalam Kehidupan Sehari-Hari. Yayasan Pustaka Obor Indonesia [Buku]", "Setiawan, B.. (2021). The Role of Pancasila in National Character Building. Journal of Indonesian Political Science [Jurnal]", "Kusnadi, E.. (2022). Pancasila Ethics in Addressing Social Issues. International Journal of Ethics and Governance [Jurnal]", "Rahman, F.. (2023). Analyzing Social Problems through Pancasila Perspective. Indonesian Journal of Social Sciences [Jurnal]", "Yusuf, M.. (2020). Pancasila as a Foundation for Professional Ethics. Journal of Professional Ethics [Jurnal]", "Nugroho, I.. (2023). Moral Integrity and Social Responsibility in Education. Educational Journal of Ethics [Jurnal]"], "bahanKajian": ["Topik 1: Sejarah dan Filosofi Pancasila - Membahas latar belakang historis dan pemikiran yang melandasi Pancasila sebagai dasar negara, serta nilai-nilai yang terkandung di dalamnya.", "Topik 2: Nilai-Nilai Pancasila dalam Kehidupan Sehari-hari - Menganalisis penerapan nilai-nilai Pancasila dalam konteks kehidupan masyarakat, termasuk dalam interaksi sosial dan hubungan antar individu.", "Topik 3: Prinsip Etika Pancasila dalam Pengambilan Keputusan - Mengkaji bagaimana prinsip etika Pancasila dapat dijadikan pedoman dalam pengambilan keputusan yang adil dan berkeadilan sosial.", "Topik 4: Analisis Masalah Sosial melalui Lensa Pancasila - Menerapkan perspektif etika Pancasila untuk menganalisis berbagai persoalan sosial yang dihadapi masyarakat saat ini.", "Topik 5: Tanggung Jawab Sosial dan Moralitas dalam Pendidikan - Meneliti pentingnya sikap integritas dan moralitas dalam lingkungan akademik dan dampaknya terhadap tanggung jawab sosial mahasiswa.", "Topik 6: Peran Pancasila dalam Membangun Karakter Bangsa - Menjelaskan bagaimana Pancasila dapat berkontribusi dalam membentuk karakter bangsa yang berintegritas dan bertanggung jawab.", "Topik 7: Tantangan Penerapan Pancasila di Era Globalisasi - Menganalisis berbagai tantangan yang dihadapi dalam menerapkan nilai-nilai Pancasila di tengah arus globalisasi dan perkembangan teknologi.", "Topik 8: Pancasila sebagai Landasan Etika dalam Profesi - Mengkaji relevansi Pancasila sebagai dasar etika dalam berbagai profesi dan implikasinya terhadap praktik profesional yang baik."], "rencanaTugas": [{"order": 1, "subCpmk": "Sub-CPMK-1", "tugasKe": 1, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi dan menjelaskan lima nilai dasar pancasila dalam konteks kehidupan sosial masyarakat.", "batasWaktu": "Minggu ke-1", "judulTugas": "Tugas 1: Mahasiswa mampu mengidentifikasi dan menjelaskan lima nilai ...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-1", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-1 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-1\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi dan menjelaskan lima nilai dasar Pancasila dalam konteks kehidupan sosial masyarakat.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 2, "subCpmk": "Sub-CPMK-2", "tugasKe": 2, "indikator": "Mahasiswa mampu mahasiswa mampu mendeskripsikan nilai-nilai dasar pancasila dan implementasinya dalam kehidupan sehari-hari.", "batasWaktu": "Minggu ke-2", "judulTugas": "Tugas 2: Mahasiswa mampu mendeskripsikan nilai-nilai dasar Pancasila ...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-2", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-2 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-2\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mendeskripsikan nilai-nilai dasar Pancasila dan implementasinya dalam kehidupan sehari-hari.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 3, "subCpmk": "Sub-CPMK-3", "tugasKe": 3, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi dan menjelaskan nilai-nilai dasar pancasila dalam konteks kehidupan sehari-hari.", "batasWaktu": "Minggu ke-3", "judulTugas": "Tugas 3: Mahasiswa mampu mengidentifikasi dan menjelaskan nilai-nilai...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-3", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-3 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-3\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi dan menjelaskan nilai-nilai dasar Pancasila dalam konteks kehidupan sehari-hari.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 4, "subCpmk": "Sub-CPMK-4", "tugasKe": 4, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi dan menjelaskan lima nilai utama pancasila serta relevansinya dalam kehidupan sehari-hari.", "batasWaktu": "Minggu ke-4", "judulTugas": "Tugas 4: Mahasiswa mampu mengidentifikasi dan menjelaskan lima nilai ...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-4", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-4 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-4\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi dan menjelaskan lima nilai utama Pancasila serta relevansinya dalam kehidupan sehari-hari.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 5, "subCpmk": "Sub-CPMK-5", "tugasKe": 5, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi dan mendeskripsikan persoalan sosial yang relevan dengan prinsip etika pancasila dalam konteks masyarakat saat ini.", "batasWaktu": "Minggu ke-5", "judulTugas": "Tugas 5: Mahasiswa mampu mengidentifikasi dan mendeskripsikan persoal...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-5", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-5 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-5\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi dan mendeskripsikan persoalan sosial yang relevan dengan prinsip etika Pancasila dalam konteks masyarakat saat ini.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 6, "subCpmk": "Sub-CPMK-6", "tugasKe": 6, "indikator": "Mahasiswa mampu mahasiswa dapat mengidentifikasi dan menjelaskan persoalan sosial yang relevan dengan nilai-nilai pancasila.", "batasWaktu": "Minggu ke-6", "judulTugas": "Tugas 6: Mahasiswa dapat mengidentifikasi dan menjelaskan persoalan s...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-6", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-6 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-6\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa dapat mengidentifikasi dan menjelaskan persoalan sosial yang relevan dengan nilai-nilai Pancasila.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 7, "subCpmk": "Sub-CPMK-7", "tugasKe": 7, "indikator": "Mahasiswa mampu mahasiswa dapat mengidentifikasi dan mendeskripsikan persoalan sosial yang relevan dengan nilai-nilai pancasila.", "batasWaktu": "Minggu ke-7", "judulTugas": "Tugas 7: Mahasiswa dapat mengidentifikasi dan mendeskripsikan persoal...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-7", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-7 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-7\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa dapat mengidentifikasi dan mendeskripsikan persoalan sosial yang relevan dengan nilai-nilai Pancasila.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 8, "subCpmk": "Sub-CPMK-8", "tugasKe": 8, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi dan merumuskan persoalan sosial yang relevan dengan nilai-nilai pancasila.", "batasWaktu": "Minggu ke-8", "judulTugas": "Tugas 8: Mahasiswa mampu mengidentifikasi dan merumuskan persoalan so...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-8", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-8 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-8\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi dan merumuskan persoalan sosial yang relevan dengan nilai-nilai Pancasila.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 9, "subCpmk": "Sub-CPMK-9", "tugasKe": 9, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi dan menjelaskan nilai-nilai pancasila yang berhubungan dengan integritas dan moralitas dalam kehidupan sehari-hari.", "batasWaktu": "Minggu ke-9", "judulTugas": "Tugas 9: Mahasiswa mampu mengidentifikasi dan menjelaskan nilai-nilai...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-9", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-9 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-9\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi dan menjelaskan nilai-nilai Pancasila yang berhubungan dengan integritas dan moralitas dalam kehidupan sehari-hari.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 10, "subCpmk": "Sub-CPMK-10", "tugasKe": 10, "indikator": "Mahasiswa mampu mahasiswa dapat menjelaskan konsep integritas dan moralitas dalam konteks pancasila dan aplikasinya dalam kehidupan sehari-hari.", "batasWaktu": "Minggu ke-10", "judulTugas": "Tugas 10: Mahasiswa dapat menjelaskan konsep integritas dan moralitas ...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-10", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-10 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-10\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa dapat menjelaskan konsep integritas dan moralitas dalam konteks Pancasila dan aplikasinya dalam kehidupan sehari-hari.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 11, "subCpmk": "Sub-CPMK-11", "tugasKe": 11, "indikator": "Mahasiswa mampu mahasiswa dapat menjelaskan konsep integritas dan moralitas dalam konteks pancasila secara tertulis.", "batasWaktu": "Minggu ke-11", "judulTugas": "Tugas 11: Mahasiswa dapat menjelaskan konsep integritas dan moralitas ...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-11", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-11 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-11\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa dapat menjelaskan konsep integritas dan moralitas dalam konteks Pancasila secara tertulis.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 12, "subCpmk": "Sub-CPMK-12", "tugasKe": 12, "indikator": "Mahasiswa mampu mahasiswa dapat menjelaskan konsep integritas dan moralitas dalam konteks pancasila dan penerapannya dalam kehidupan sehari-hari.", "batasWaktu": "Minggu ke-12", "judulTugas": "Tugas 12: Mahasiswa dapat menjelaskan konsep integritas dan moralitas ...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-12", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-12 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-12\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa dapat menjelaskan konsep integritas dan moralitas dalam konteks Pancasila dan penerapannya dalam kehidupan sehari-hari.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 13, "subCpmk": "Sub-CPMK-13", "tugasKe": 13, "indikator": "Mahasiswa mampu mahasiswa dapat mengidentifikasi dan menjelaskan nilai-nilai pancasila yang relevan dalam situasi pengambilan keputusan.", "batasWaktu": "Minggu ke-13", "judulTugas": "Tugas 13: Mahasiswa dapat mengidentifikasi dan menjelaskan nilai-nilai...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-13", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-13 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-13\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa dapat mengidentifikasi dan menjelaskan nilai-nilai Pancasila yang relevan dalam situasi pengambilan keputusan.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 14, "subCpmk": "Sub-CPMK-14", "tugasKe": 14, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi dan menganalisis kasus-kasus pengambilan keputusan yang mencerminkan nilai-nilai pancasila dalam konteks sosial dan ekonomi.", "batasWaktu": "Minggu ke-14", "judulTugas": "Tugas 14: Mahasiswa mampu mengidentifikasi dan menganalisis kasus-kasu...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-14", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-14 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-14\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi dan menganalisis kasus-kasus pengambilan keputusan yang mencerminkan nilai-nilai Pancasila dalam konteks sosial dan ekonomi.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}], "rencanaMingguan": [{"materi": "Sejarah dan Filosofi Pancasila", "metode": "Ceramah, Diskusi", "minggu": 1, "subCpmk": "Sub-CPMK-1", "penilaian": "Quiz"}, {"materi": "Nilai-Nilai Pancasila dalam Kehidupan Sehari-hari", "metode": "Praktikum, Diskusi Kelompok", "minggu": 2, "subCpmk": "Sub-CPMK-2", "penilaian": "Tugas"}, {"materi": "Implementasi Nilai-Nilai Pancasila dalam Kehidupan Sehari-hari", "metode": "Ceramah, Diskusi", "minggu": 3, "subCpmk": "Sub-CPMK-3", "penilaian": "Quiz"}, {"materi": "Lima Nilai Utama Pancasila dan Relevansinya", "metode": "Ceramah, Diskusi", "minggu": 4, "subCpmk": "Sub-CPMK-4", "penilaian": "Tugas"}, {"materi": "Persoalan Sosial dan Prinsip Etika Pancasila", "metode": "Analisis Kasus, Diskusi", "minggu": 5, "subCpmk": "Sub-CPMK-5", "penilaian": "Presentasi"}, {"materi": "Identifikasi Persoalan Sosial yang Relevan dengan Nilai-Nilai Pancasila", "metode": "Diskusi, Praktikum", "minggu": 6, "subCpmk": "Sub-CPMK-6", "penilaian": "Tugas"}, {"materi": "Merumuskan Persoalan Sosial yang Relevan dengan Nilai-Nilai Pancasila", "metode": "Workshop, Diskusi", "minggu": 7, "subCpmk": "Sub-CPMK-7", "penilaian": "Proyek Kecil"}, {"materi": "Konsep Integritas dan Moralitas dalam Konteks Pancasila", "metode": "Ceramah, Diskusi", "minggu": 9, "subCpmk": "Sub-CPMK-8", "penilaian": "Quiz"}, {"materi": "Penerapan Integritas dan Moralitas dalam Kehidupan Sehari-hari", "metode": "Praktikum, Diskusi", "minggu": 10, "subCpmk": "Sub-CPMK-9", "penilaian": "Tugas"}, {"materi": "Konsep Integritas dan Moralitas secara Tertulis", "metode": "Tugas Individu", "minggu": 11, "subCpmk": "Sub-CPMK-10", "penilaian": "Laporan"}, {"materi": "Pengambilan Keputusan yang Mencerminkan Nilai-Nilai Pancasila", "metode": "Analisis Kasus, Diskusi", "minggu": 12, "subCpmk": "Sub-CPMK-11", "penilaian": "Presentasi"}, {"materi": "Analisis Kasus Pengambilan Keputusan dalam Konteks Sosial dan Ekonomi", "metode": "Diskusi, Praktikum", "minggu": 13, "subCpmk": "Sub-CPMK-12", "penilaian": "Tugas"}, {"materi": "Peran Pancasila dalam Membangun Karakter Bangsa", "metode": "Ceramah, Diskusi", "minggu": 14, "subCpmk": "Sub-CPMK-13", "penilaian": "Quiz"}]}	\N	\N	2025-12-18 00:32:58.046364+08	2025-12-18 19:32:59.998975+08	\N
c8e73edb-00d2-40c8-b590-125f460175c2	\N	ef59bbe0-fbb1-4b7e-8af6-edc29da9d512	\N	completed	{"cpmk": [{"code": "CPMK-1", "order": 1, "description": "menjelaskan prinsip-prinsip dasar ajaran Islam terkait etika, akhlak, dan profesionalitas. (CPL 09)", "selected_cpls": ["CPL-09", "CPL-10"]}, {"code": "CPMK-2", "order": 2, "description": "Mahasiswa mampu menerapkan nilai-nilai keislaman dalam sikap, perilaku akademik, dan pengambilan keputusan. (CPL 10)", "selected_cpls": ["CPL-10", "CPL-09"]}, {"code": "CPMK-3", "order": 3, "description": "Mahasiswa mampu mengintegrasikan ajaran Islam dengan konteks sosial, budaya, dan profesi teknik pengairan. (CPL 10)", "selected_cpls": ["CPL-10", "CPL-02", "CPL-09"]}, {"code": "CPMK-4", "order": 4, "description": "Mahasiswa mampu menunjukkan komitmen terhadap nilai keberlanjutan, amanah, dan keadilan dalam praktik akademik. (CPL 08)", "selected_cpls": ["CPL-02", "CPL-10", "CPL-09"]}], "course": {"id": "ef59bbe0-fbb1-4b7e-8af6-edc29da9d512", "code": "AW60910042105", "title": "Pendidikan Agama Islam", "credits": 2, "semester": 1}, "subCpmk": [{"code": "Sub-CPMK-1", "order": 1, "description": "Mengidentifikasi dan menjelaskan prinsip-prinsip etika dalam ajaran Islam berdasarkan sumber-sumber utama seperti Al-Qur'an dan Hadis.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-2", "order": 2, "description": "Mengidentifikasi dan menjelaskan konsep dasar etika dalam Islam serta peranannya dalam kehidupan sehari-hari.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-3", "order": 3, "description": "Mengidentifikasi dan menjelaskan sumber-sumber ajaran Islam yang membahas etika dan akhlak.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-4", "order": 4, "description": "Mengidentifikasi dan menjelaskan nilai-nilai etika dalam ajaran Islam yang berkaitan dengan perilaku sehari-hari.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-5", "order": 5, "description": "Mahasiswa dapat mengidentifikasi dan menjelaskan nilai-nilai keislaman yang relevan dalam konteks akademik.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-6", "order": 6, "description": "Mahasiswa mampu menjelaskan prinsip-prinsip keislaman yang relevan dengan etika akademik dalam tugas dan interaksi sehari-hari.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-7", "order": 7, "description": "Mahasiswa dapat menjelaskan prinsip-prinsip keislaman yang relevan dalam konteks akademik dan kehidupan sehari-hari.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-8", "order": 8, "description": "Mahasiswa mampu menjelaskan prinsip-prinsip dasar nilai keislaman yang relevan dengan perilaku akademik.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-9", "order": 9, "description": "Mahasiswa mampu menjelaskan prinsip-prinsip ajaran Islam yang relevan dengan praktik teknik pengairan di masyarakat.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-10", "order": 10, "description": "Mahasiswa dapat menjelaskan prinsip-prinsip dasar ajaran Islam yang relevan dengan praktik teknik pengairan.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-11", "order": 11, "description": "Mahasiswa mampu menganalisis nilai-nilai Islam yang relevan dengan praktik pengairan dalam konteks masyarakat lokal.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-12", "order": 12, "description": "Mahasiswa dapat menjelaskan prinsip-prinsip ajaran Islam yang relevan dengan pengelolaan sumber daya air dalam konteks sosial dan budaya setempat.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-13", "order": 13, "description": "Mahasiswa mampu mengidentifikasi dan menjelaskan prinsip-prinsip keberlanjutan dalam konteks ajaran Islam.", "related_cpmk": "CPMK-4"}, {"code": "Sub-CPMK-14", "order": 14, "description": "Mahasiswa mampu menjelaskan konsep keberlanjutan dalam konteks ajaran Islam dan aplikasinya dalam kehidupan sehari-hari.", "related_cpmk": "CPMK-4"}], "deskripsi": "Mata kuliah Pendidikan Agama Islam ini bertujuan untuk memberikan pemahaman mendalam mengenai ajaran, nilai-nilai, dan praktik Islam dalam konteks kehidupan sehari-hari. Materi yang akan dibahas mencakup sejarah perkembangan Islam, rukun iman dan rukun Islam, etika dan moralitas dalam Islam, serta peran agama dalam membentuk karakter individu dan masyarakat. Melalui pendekatan teoritis dan praktis, mahasiswa diharapkan dapat menginternalisasi ajaran Islam dan menerapkannya dalam kehidupan sosial, serta meningkatkan toleransi dan pemahaman antarumat beragama. Manfaat dari mata kuliah ini adalah membentuk individu yang tidak hanya memiliki pengetahuan agama yang kuat, tetapi juga mampu berkontribusi positif dalam masyarakat yang multikultural.", "referensi": ["M. Quraish Shihab. (2021). Etika dan Moral dalam Islam. Lentera Hati [Buku]", "Abdul Rahman B. H. Al-Mubarak. (2023). Islam dan Etika Lingkungan. Al-Qalam [Buku]", "M. Nur Aziz. (2022). Pendidikan Agama Islam: Teori dan Praktik. Pustaka Pelajar [Buku]", "Ali M. Al-Hassan. (2023). Islamic Ethics and Professionalism. Islamic University Press [Buku]", "Siti Aisyah. (2020). Integrasi Ajaran Islam dalam Pendidikan Multikultural. Penerbit Universitas [Buku]", "Fatima Al-Mansur. (2022). The Role of Islamic Values in Academic Behavior. International Journal of Islamic Education [Jurnal]", "Nashiruddin Ahmad. (2021). Sustainable Development in Islamic Perspective. Journal of Islamic Studies and Culture [Jurnal]", "Zainab Husain. (2023). Justice and Decision-Making in Islam. Journal of Islamic Ethics [Jurnal]", "Mohammad Iqbal. (2022). Islamic Environmental Ethics: A Study. Environmental Science and Islamic Perspective [Jurnal]", "Rizky Ramadhan. (2020). Character Building through Islamic Education. Educational Journal of Islamic Studies [Jurnal]"], "bahanKajian": ["Topik 1: Prinsip-prinsip Dasar Ajaran Islam tentang Etika dan Akhlak - Membahas nilai-nilai etika dan akhlak dalam Islam serta penerapannya dalam kehidupan sehari-hari.", "Topik 2: Profesionalitas dalam Islam - Mengkaji konsep profesionalitas dalam Islam dan bagaimana hal ini dapat diterapkan dalam berbagai profesi, termasuk teknik pengairan.", "Topik 3: Nilai-nilai Keislaman dalam Perilaku Akademik - Menjelaskan bagaimana mahasiswa dapat menerapkan nilai-nilai Islam dalam sikap dan perilaku akademik mereka.", "Topik 4: Integrasi Ajaran Islam dengan Konteks Sosial dan Budaya - Mengkaji cara mengintegrasikan ajaran Islam dengan konteks sosial dan budaya yang beragam di masyarakat.", "Topik 5: Keberlanjutan dan Amanah dalam Praktik Akademik - Membahas pentingnya komitmen terhadap nilai keberlanjutan dan amanah dalam semua aspek praktik akademik.", "Topik 6: Keadilan dalam Pengambilan Keputusan - Menjelaskan bagaimana prinsip keadilan dalam Islam dapat diterapkan dalam proses pengambilan keputusan di lingkungan akademik dan profesional.", "Topik 7: Etika Lingkungan dalam Perspektif Islam - Mengkaji pandangan Islam terkait etika lingkungan dan tanggung jawab sosial dalam konteks teknik pengairan.", "Topik 8: Peran Mahasiswa sebagai Agent of Change - Mendorong mahasiswa untuk berperan aktif dalam menyebarluaskan nilai-nilai keislaman dan etika dalam masyarakat."], "rencanaTugas": [{"order": 1, "subCpmk": "Sub-CPMK-1", "tugasKe": 1, "indikator": "Mahasiswa mampu mengidentifikasi dan menjelaskan prinsip-prinsip etika dalam ajaran islam berdasarkan sumber-sumber utama seperti al-qur'an dan hadis.", "batasWaktu": "Minggu ke-1", "judulTugas": "Tugas 1: Mengidentifikasi dan menjelaskan prinsip-prinsip etika dalam...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-1", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-1 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-1\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mengidentifikasi dan menjelaskan prinsip-prinsip etika dalam ajaran Islam berdasarkan sumber-sumber utama seperti Al-Qur'an dan Hadis.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 2, "subCpmk": "Sub-CPMK-2", "tugasKe": 2, "indikator": "Mahasiswa mampu mengidentifikasi dan menjelaskan konsep dasar etika dalam islam serta peranannya dalam kehidupan sehari-hari.", "batasWaktu": "Minggu ke-2", "judulTugas": "Tugas 2: Mengidentifikasi dan menjelaskan konsep dasar etika dalam Is...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-2", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-2 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-2\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mengidentifikasi dan menjelaskan konsep dasar etika dalam Islam serta peranannya dalam kehidupan sehari-hari.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 3, "subCpmk": "Sub-CPMK-3", "tugasKe": 3, "indikator": "Mahasiswa mampu mengidentifikasi dan menjelaskan sumber-sumber ajaran islam yang membahas etika dan akhlak.", "batasWaktu": "Minggu ke-3", "judulTugas": "Tugas 3: Mengidentifikasi dan menjelaskan sumber-sumber ajaran Islam ...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-3", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-3 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-3\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mengidentifikasi dan menjelaskan sumber-sumber ajaran Islam yang membahas etika dan akhlak.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 4, "subCpmk": "Sub-CPMK-4", "tugasKe": 4, "indikator": "Mahasiswa mampu mengidentifikasi dan menjelaskan nilai-nilai etika dalam ajaran islam yang berkaitan dengan perilaku sehari-hari.", "batasWaktu": "Minggu ke-4", "judulTugas": "Tugas 4: Mengidentifikasi dan menjelaskan nilai-nilai etika dalam aja...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-4", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-4 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-4\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mengidentifikasi dan menjelaskan nilai-nilai etika dalam ajaran Islam yang berkaitan dengan perilaku sehari-hari.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 5, "subCpmk": "Sub-CPMK-5", "tugasKe": 5, "indikator": "Mahasiswa mampu mahasiswa dapat mengidentifikasi dan menjelaskan nilai-nilai keislaman yang relevan dalam konteks akademik.", "batasWaktu": "Minggu ke-5", "judulTugas": "Tugas 5: Mahasiswa dapat mengidentifikasi dan menjelaskan nilai-nilai...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-5", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-5 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-5\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa dapat mengidentifikasi dan menjelaskan nilai-nilai keislaman yang relevan dalam konteks akademik.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 6, "subCpmk": "Sub-CPMK-6", "tugasKe": 6, "indikator": "Mahasiswa mampu mahasiswa mampu menjelaskan prinsip-prinsip keislaman yang relevan dengan etika akademik dalam tugas dan interaksi sehari-hari.", "batasWaktu": "Minggu ke-6", "judulTugas": "Tugas 6: Mahasiswa mampu menjelaskan prinsip-prinsip keislaman yang r...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-6", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-6 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-6\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu menjelaskan prinsip-prinsip keislaman yang relevan dengan etika akademik dalam tugas dan interaksi sehari-hari.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 7, "subCpmk": "Sub-CPMK-7", "tugasKe": 7, "indikator": "Mahasiswa mampu mahasiswa dapat menjelaskan prinsip-prinsip keislaman yang relevan dalam konteks akademik dan kehidupan sehari-hari.", "batasWaktu": "Minggu ke-7", "judulTugas": "Tugas 7: Mahasiswa dapat menjelaskan prinsip-prinsip keislaman yang r...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-7", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-7 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-7\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa dapat menjelaskan prinsip-prinsip keislaman yang relevan dalam konteks akademik dan kehidupan sehari-hari.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 8, "subCpmk": "Sub-CPMK-8", "tugasKe": 8, "indikator": "Mahasiswa mampu mahasiswa mampu menjelaskan prinsip-prinsip dasar nilai keislaman yang relevan dengan perilaku akademik.", "batasWaktu": "Minggu ke-8", "judulTugas": "Tugas 8: Mahasiswa mampu menjelaskan prinsip-prinsip dasar nilai keis...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-8", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-8 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-8\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu menjelaskan prinsip-prinsip dasar nilai keislaman yang relevan dengan perilaku akademik.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 9, "subCpmk": "Sub-CPMK-9", "tugasKe": 9, "indikator": "Mahasiswa mampu mahasiswa mampu menjelaskan prinsip-prinsip ajaran islam yang relevan dengan praktik teknik pengairan di masyarakat.", "batasWaktu": "Minggu ke-9", "judulTugas": "Tugas 9: Mahasiswa mampu menjelaskan prinsip-prinsip ajaran Islam yan...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-9", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-9 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-9\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu menjelaskan prinsip-prinsip ajaran Islam yang relevan dengan praktik teknik pengairan di masyarakat.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 10, "subCpmk": "Sub-CPMK-10", "tugasKe": 10, "indikator": "Mahasiswa mampu mahasiswa dapat menjelaskan prinsip-prinsip dasar ajaran islam yang relevan dengan praktik teknik pengairan.", "batasWaktu": "Minggu ke-10", "judulTugas": "Tugas 10: Mahasiswa dapat menjelaskan prinsip-prinsip dasar ajaran Isl...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-10", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-10 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-10\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa dapat menjelaskan prinsip-prinsip dasar ajaran Islam yang relevan dengan praktik teknik pengairan.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 11, "subCpmk": "Sub-CPMK-11", "tugasKe": 11, "indikator": "Mahasiswa mampu mahasiswa mampu menganalisis nilai-nilai islam yang relevan dengan praktik pengairan dalam konteks masyarakat lokal.", "batasWaktu": "Minggu ke-11", "judulTugas": "Tugas 11: Mahasiswa mampu menganalisis nilai-nilai Islam yang relevan ...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-11", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-11 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-11\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu menganalisis nilai-nilai Islam yang relevan dengan praktik pengairan dalam konteks masyarakat lokal.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 12, "subCpmk": "Sub-CPMK-12", "tugasKe": 12, "indikator": "Mahasiswa mampu mahasiswa dapat menjelaskan prinsip-prinsip ajaran islam yang relevan dengan pengelolaan sumber daya air dalam konteks sosial dan budaya setempat.", "batasWaktu": "Minggu ke-12", "judulTugas": "Tugas 12: Mahasiswa dapat menjelaskan prinsip-prinsip ajaran Islam yan...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-12", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-12 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-12\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa dapat menjelaskan prinsip-prinsip ajaran Islam yang relevan dengan pengelolaan sumber daya air dalam konteks sosial dan budaya setempat.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 13, "subCpmk": "Sub-CPMK-13", "tugasKe": 13, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi dan menjelaskan prinsip-prinsip keberlanjutan dalam konteks ajaran islam.", "batasWaktu": "Minggu ke-13", "judulTugas": "Tugas 13: Mahasiswa mampu mengidentifikasi dan menjelaskan prinsip-pri...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-13", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-13 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-13\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi dan menjelaskan prinsip-prinsip keberlanjutan dalam konteks ajaran Islam.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 14, "subCpmk": "Sub-CPMK-14", "tugasKe": 14, "indikator": "Mahasiswa mampu mahasiswa mampu menjelaskan konsep keberlanjutan dalam konteks ajaran islam dan aplikasinya dalam kehidupan sehari-hari.", "batasWaktu": "Minggu ke-14", "judulTugas": "Tugas 14: Mahasiswa mampu menjelaskan konsep keberlanjutan dalam konte...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-14", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-14 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-14\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu menjelaskan konsep keberlanjutan dalam konteks ajaran Islam dan aplikasinya dalam kehidupan sehari-hari.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}], "rencanaMingguan": [{"materi": "Prinsip-prinsip dasar ajaran Islam tentang etika dan akhlak", "metode": "Ceramah, Diskusi", "minggu": 1, "subCpmk": "Sub-CPMK-1", "penilaian": "Quiz"}, {"materi": "Konsep dasar etika dalam Islam dan peranannya dalam kehidupan sehari-hari", "metode": "Ceramah, Diskusi", "minggu": 2, "subCpmk": "Sub-CPMK-2", "penilaian": "Tugas"}, {"materi": "Sumber-sumber ajaran Islam yang membahas etika dan akhlak", "metode": "Ceramah, Diskusi", "minggu": 3, "subCpmk": "Sub-CPMK-3", "penilaian": "Quiz"}, {"materi": "Nilai-nilai etika dalam ajaran Islam yang berkaitan dengan perilaku sehari-hari", "metode": "Praktikum, Diskusi", "minggu": 4, "subCpmk": "Sub-CPMK-4", "penilaian": "Tugas"}, {"materi": "Nilai-nilai keislaman yang relevan dalam konteks akademik", "metode": "Ceramah, Diskusi", "minggu": 5, "subCpmk": "Sub-CPMK-5", "penilaian": "Quiz"}, {"materi": "Prinsip-prinsip keislaman yang relevan dengan etika akademik", "metode": "Praktikum, Diskusi", "minggu": 6, "subCpmk": "Sub-CPMK-6", "penilaian": "Tugas"}, {"materi": "Prinsip-prinsip keislaman yang relevan dalam konteks akademik dan kehidupan sehari-hari", "metode": "Ceramah, Diskusi", "minggu": 7, "subCpmk": "Sub-CPMK-7", "penilaian": "Quiz"}, {"materi": "Prinsip-prinsip ajaran Islam yang relevan dengan praktik teknik pengairan di masyarakat", "metode": "Ceramah, Diskusi", "minggu": 9, "subCpmk": "Sub-CPMK-8", "penilaian": "Tugas"}, {"materi": "Prinsip-prinsip dasar ajaran Islam yang relevan dengan praktik teknik pengairan", "metode": "Praktikum, Diskusi", "minggu": 10, "subCpmk": "Sub-CPMK-9", "penilaian": "Quiz"}, {"materi": "Analisis nilai-nilai Islam yang relevan dengan praktik pengairan dalam konteks masyarakat lokal", "metode": "Ceramah, Diskusi", "minggu": 11, "subCpmk": "Sub-CPMK-10", "penilaian": "Tugas"}, {"materi": "Prinsip-prinsip ajaran Islam yang relevan dengan pengelolaan sumber daya air", "metode": "Ceramah, Diskusi", "minggu": 12, "subCpmk": "Sub-CPMK-11", "penilaian": "Quiz"}, {"materi": "Prinsip-prinsip keberlanjutan dalam konteks ajaran Islam", "metode": "Praktikum, Diskusi", "minggu": 13, "subCpmk": "Sub-CPMK-12", "penilaian": "Tugas"}, {"materi": "Konsep keberlanjutan dalam konteks ajaran Islam dan aplikasinya dalam kehidupan sehari-hari", "metode": "Ceramah, Diskusi", "minggu": 14, "subCpmk": "Sub-CPMK-13", "penilaian": "Quiz"}]}	\N	\N	2025-12-18 00:26:14.130773+08	2025-12-18 19:33:02.575196+08	\N
c19552ef-23cc-4b37-ab48-a0a86afce915	\N	036843d8-177a-4b11-8928-1d560a7b4d1d	\N	completed	{"cpmk": [{"code": "CPMK-1", "order": 1, "description": "Mahasiswa mampu menyusun tulisan ilmiah yang efektif, logis, dan sesuai kaidah bahasa Indonesia akademik. (CPL 06)", "selected_cpls": ["CPL-06", "CPL-01"]}, {"code": "CPMK-2", "order": 2, "description": "Mahasiswa mampu mengevaluasi penggunaan bahasa dalam laporan, makalah, dan tulisan sumber daya air secara profesional.", "selected_cpls": ["CPL-06", "CPL-01"]}, {"code": "CPMK-3", "order": 3, "description": "Mahasiswa mampu berkomunikasi secara tertulis untuk menyampaikan ide sumber daya air secara informatif dan etis.", "selected_cpls": ["CPL-06", "CPL-09"]}, {"code": "CPMK-4", "order": 4, "description": "Mahasiswa mampu menggunakan teknik penulisan akademik untuk mendukung publikasi dan presentasi ilmiah.", "selected_cpls": ["CPL-06"]}], "course": {"id": "036843d8-177a-4b11-8928-1d560a7b4d1d", "code": "AW60910042103", "title": "Bahasa Indonesia", "credits": 2, "semester": 1}, "subCpmk": [{"code": "Sub-CPMK-1", "order": 1, "description": "Mahasiswa mampu mengidentifikasi dan merumuskan topik penelitian yang relevan dan menarik dalam konteks akademik.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-2", "order": 2, "description": "Mahasiswa mampu mengidentifikasi dan merumuskan topik penelitian yang relevan dan menarik untuk tulisan ilmiah.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-3", "order": 3, "description": "Mahasiswa mampu menyusun kerangka tulisan ilmiah yang sistematis dan logis.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-4", "order": 4, "description": "Mahasiswa mampu merumuskan topik penelitian yang relevan dan menarik untuk tulisan ilmiah.", "related_cpmk": "CPMK-1"}, {"code": "Sub-CPMK-5", "order": 5, "description": "Mahasiswa mampu mengidentifikasi dan menganalisis penggunaan istilah teknis dalam laporan sumber daya air.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-6", "order": 6, "description": "Mahasiswa mampu mengidentifikasi dan menganalisis kesalahan bahasa dalam laporan sumber daya air.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-7", "order": 7, "description": "Mahasiswa mampu mengidentifikasi kesalahan penggunaan bahasa dalam laporan sumber daya air.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-8", "order": 8, "description": "Mahasiswa mampu mengidentifikasi dan menganalisis penggunaan istilah teknis yang tepat dalam laporan sumber daya air.", "related_cpmk": "CPMK-2"}, {"code": "Sub-CPMK-9", "order": 9, "description": "Mahasiswa dapat menyusun laporan tertulis mengenai penggunaan sumber daya air yang ramah lingkungan.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-10", "order": 10, "description": "Mahasiswa mampu menulis artikel ilmiah tentang pengelolaan sumber daya air dengan struktur yang jelas dan argumentasi yang logis.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-11", "order": 11, "description": "Mahasiswa dapat menulis artikel tentang pengelolaan sumber daya air dengan struktur yang jelas dan logis.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-12", "order": 12, "description": "Mahasiswa mampu menyusun laporan tertulis tentang analisis kualitas sumber daya air dengan menggunakan data dan referensi yang valid.", "related_cpmk": "CPMK-3"}, {"code": "Sub-CPMK-13", "order": 13, "description": "Mahasiswa mampu menyusun kerangka tulisan akademik yang sistematis dan logis.", "related_cpmk": "CPMK-4"}, {"code": "Sub-CPMK-14", "order": 14, "description": "Mahasiswa mampu menyusun kerangka tulisan akademik yang jelas dan terstruktur untuk mendukung publikasi ilmiah.", "related_cpmk": "CPMK-4"}], "deskripsi": "Mata kuliah Bahasa Indonesia ini bertujuan untuk meningkatkan kemampuan komunikasi lisan dan tulisan dalam Bahasa Indonesia yang baik dan benar. Materi yang diajarkan mencakup tata bahasa, kosakata, struktur kalimat, serta keterampilan membaca dan menulis yang efektif. Selain itu, mahasiswa akan diajak untuk memahami dan menganalisis teks sastra dan non-sastra, sehingga dapat menghargai kekayaan budaya dan bahasa Indonesia. Manfaat dari mata kuliah ini adalah kemampuan mahasiswa untuk berkomunikasi secara efektif dalam konteks akademik dan profesional, serta memperkuat identitas kebangsaannya melalui penguasaan bahasa yang baik.", "referensi": ["A. S. Rachman. (2023). Penulisan Ilmiah untuk Mahasiswa. Penerbit Universitas Indonesia [Buku]", "B. M. Prasetyo. (2022). Kaidah Bahasa Indonesia dalam Penulisan Akademik. Penerbit Salemba Humanika [Buku]", "C. D. Setiawan. (2021). Teknik Penulisan Ilmiah. Penerbit Erlangga [Buku]", "E. F. Kusuma. (2020). Strategi Komunikasi Tertulis. Penerbit Andi [Buku]", "F. G. Santoso. (2023). Etika Penulisan dalam Riset. Penerbit Rajawali [Buku]", "H. I. Rahman. (2022). Evaluasi Bahasa dalam Penulisan Laporan. Jurnal Linguistik dan Sastra [Jurnal]", "J. K. Wibowo. (2023). Komunikasi Efektif dalam Penulisan Ilmiah. Jurnal Pendidikan Bahasa dan Sastra [Jurnal]", "L. M. Sari. (2021). Analisis Penulisan Ilmiah di Era Digital. Jurnal Penelitian dan Pendidikan [Jurnal]"], "bahanKajian": ["Topik 1: Pengantar Penulisan Ilmiah - Memahami struktur dan komponen dasar penulisan ilmiah, termasuk pengantar, tinjauan pustaka, metodologi, hasil, dan kesimpulan.", "Topik 2: Kaidah Bahasa Indonesia Akademik - Mengkaji kaidah-kaidah bahasa Indonesia yang berlaku dalam penulisan akademik, termasuk ejaan, tata bahasa, dan penggunaan istilah yang tepat.", "Topik 3: Evaluasi Laporan dan Makalah - Teknik untuk menilai penggunaan bahasa dalam laporan dan makalah, dengan fokus pada kejelasan, konsistensi, dan kesesuaian dengan konteks sumber daya air.", "Topik 4: Komunikasi Tertulis yang Efektif - Strategi untuk menyampaikan ide secara informatif dan etis dalam konteks sumber daya air, termasuk penggunaan argumen yang logis dan bukti pendukung.", "Topik 5: Teknik Penulisan Akademik - Penerapan teknik-teknik penulisan akademik yang mendukung publikasi dan presentasi ilmiah, termasuk penyusunan abstrak, pengorganisasian konten, dan penulisan referensi.", "Topik 6: Etika Penulisan dalam Penelitian - Menyelidiki pentingnya etika dalam penulisan ilmiah, termasuk plagiarisme, pengakuan sumber, dan integritas penelitian.", "Topik 7: Presentasi Ilmiah yang Efektif - Menyusun dan menyampaikan presentasi ilmiah yang menarik dan informatif, dengan penekanan pada keterampilan berbicara di depan umum dan penggunaan media visual.", "Topik 8: Analisis Kasus Sumber Daya Air - Studi kasus mengenai penggunaan bahasa dalam laporan dan penelitian terkait sumber daya air, dengan penekanan pada analisis kritis dan evaluasi hasil."], "rencanaTugas": [{"order": 1, "subCpmk": "Sub-CPMK-1", "tugasKe": 1, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi dan merumuskan topik penelitian yang relevan dan menarik dalam konteks akademik.", "batasWaktu": "Minggu ke-1", "judulTugas": "Tugas 1: Mahasiswa mampu mengidentifikasi dan merumuskan topik peneli...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-1", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-1 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-1\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi dan merumuskan topik penelitian yang relevan dan menarik dalam konteks akademik.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 2, "subCpmk": "Sub-CPMK-2", "tugasKe": 2, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi dan merumuskan topik penelitian yang relevan dan menarik untuk tulisan ilmiah.", "batasWaktu": "Minggu ke-2", "judulTugas": "Tugas 2: Mahasiswa mampu mengidentifikasi dan merumuskan topik peneli...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-2", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-2 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-2\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi dan merumuskan topik penelitian yang relevan dan menarik untuk tulisan ilmiah.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 3, "subCpmk": "Sub-CPMK-3", "tugasKe": 3, "indikator": "Mahasiswa mampu mahasiswa mampu menyusun kerangka tulisan ilmiah yang sistematis dan logis.", "batasWaktu": "Minggu ke-3", "judulTugas": "Tugas 3: Mahasiswa mampu menyusun kerangka tulisan ilmiah yang sistem...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-3", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-3 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-3\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu menyusun kerangka tulisan ilmiah yang sistematis dan logis.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 4, "subCpmk": "Sub-CPMK-4", "tugasKe": 4, "indikator": "Mahasiswa mampu mahasiswa mampu merumuskan topik penelitian yang relevan dan menarik untuk tulisan ilmiah.", "batasWaktu": "Minggu ke-4", "judulTugas": "Tugas 4: Mahasiswa mampu merumuskan topik penelitian yang relevan dan...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-4", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-4 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-4\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu merumuskan topik penelitian yang relevan dan menarik untuk tulisan ilmiah.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 5, "subCpmk": "Sub-CPMK-5", "tugasKe": 5, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi dan menganalisis penggunaan istilah teknis dalam laporan sumber daya air.", "batasWaktu": "Minggu ke-5", "judulTugas": "Tugas 5: Mahasiswa mampu mengidentifikasi dan menganalisis penggunaan...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-5", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-5 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-5\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi dan menganalisis penggunaan istilah teknis dalam laporan sumber daya air.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 6, "subCpmk": "Sub-CPMK-6", "tugasKe": 6, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi dan menganalisis kesalahan bahasa dalam laporan sumber daya air.", "batasWaktu": "Minggu ke-6", "judulTugas": "Tugas 6: Mahasiswa mampu mengidentifikasi dan menganalisis kesalahan ...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-6", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-6 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-6\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi dan menganalisis kesalahan bahasa dalam laporan sumber daya air.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 7, "subCpmk": "Sub-CPMK-7", "tugasKe": 7, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi kesalahan penggunaan bahasa dalam laporan sumber daya air.", "batasWaktu": "Minggu ke-7", "judulTugas": "Tugas 7: Mahasiswa mampu mengidentifikasi kesalahan penggunaan bahasa...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-7", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-7 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-7\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi kesalahan penggunaan bahasa dalam laporan sumber daya air.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 8, "subCpmk": "Sub-CPMK-8", "tugasKe": 8, "indikator": "Mahasiswa mampu mahasiswa mampu mengidentifikasi dan menganalisis penggunaan istilah teknis yang tepat dalam laporan sumber daya air.", "batasWaktu": "Minggu ke-8", "judulTugas": "Tugas 8: Mahasiswa mampu mengidentifikasi dan menganalisis penggunaan...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-8", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-8 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-8\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu mengidentifikasi dan menganalisis penggunaan istilah teknis yang tepat dalam laporan sumber daya air.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 9, "subCpmk": "Sub-CPMK-9", "tugasKe": 9, "indikator": "Mahasiswa mampu mahasiswa dapat menyusun laporan tertulis mengenai penggunaan sumber daya air yang ramah lingkungan.", "batasWaktu": "Minggu ke-9", "judulTugas": "Tugas 9: Mahasiswa dapat menyusun laporan tertulis mengenai penggunaa...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-9", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-9 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-9\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa dapat menyusun laporan tertulis mengenai penggunaan sumber daya air yang ramah lingkungan.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 10, "subCpmk": "Sub-CPMK-10", "tugasKe": 10, "indikator": "Mahasiswa mampu mahasiswa mampu menulis artikel ilmiah tentang pengelolaan sumber daya air dengan struktur yang jelas dan argumentasi yang logis.", "batasWaktu": "Minggu ke-10", "judulTugas": "Tugas 10: Mahasiswa mampu menulis artikel ilmiah tentang pengelolaan s...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-10", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-10 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-10\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu menulis artikel ilmiah tentang pengelolaan sumber daya air dengan struktur yang jelas dan argumentasi yang logis.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 11, "subCpmk": "Sub-CPMK-11", "tugasKe": 11, "indikator": "Mahasiswa mampu mahasiswa dapat menulis artikel tentang pengelolaan sumber daya air dengan struktur yang jelas dan logis.", "batasWaktu": "Minggu ke-11", "judulTugas": "Tugas 11: Mahasiswa dapat menulis artikel tentang pengelolaan sumber d...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-11", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-11 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-11\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa dapat menulis artikel tentang pengelolaan sumber daya air dengan struktur yang jelas dan logis.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 12, "subCpmk": "Sub-CPMK-12", "tugasKe": 12, "indikator": "Mahasiswa mampu mahasiswa mampu menyusun laporan tertulis tentang analisis kualitas sumber daya air dengan menggunakan data dan referensi yang valid.", "batasWaktu": "Minggu ke-12", "judulTugas": "Tugas 12: Mahasiswa mampu menyusun laporan tertulis tentang analisis k...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-12", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-12 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-12\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu menyusun laporan tertulis tentang analisis kualitas sumber daya air dengan menggunakan data dan referensi yang valid.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 13, "subCpmk": "Sub-CPMK-13", "tugasKe": 13, "indikator": "Mahasiswa mampu mahasiswa mampu menyusun kerangka tulisan akademik yang sistematis dan logis.", "batasWaktu": "Minggu ke-13", "judulTugas": "Tugas 13: Mahasiswa mampu menyusun kerangka tulisan akademik yang sist...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-13", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-13 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-13\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu menyusun kerangka tulisan akademik yang sistematis dan logis.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}, {"order": 14, "subCpmk": "Sub-CPMK-14", "tugasKe": 14, "indikator": "Mahasiswa mampu mahasiswa mampu menyusun kerangka tulisan akademik yang jelas dan terstruktur untuk mendukung publikasi ilmiah.", "batasWaktu": "Minggu ke-14", "judulTugas": "Tugas 14: Mahasiswa mampu menyusun kerangka tulisan akademik yang jela...", "bobotPersen": "7%", "luaranTugas": "Laporan/dokumen tertulis yang menunjukkan pemahaman terhadap Sub-CPMK-14", "teknikPenilaian": "Penilaian hasil kerja/laporan", "kriteriaPenilaian": "- Kesesuaian dengan Sub-CPMK-14 (40%)\\n- Kelengkapan dan kedalaman isi (30%)\\n- Kerapihan dan sistematika penulisan (20%)\\n- Ketepatan waktu pengumpulan (10%)", "petunjukPengerjaan": "1. Pelajari materi terkait Sub-CPMK-14\\n2. Kerjakan tugas sesuai dengan capaian pembelajaran: \\"Mahasiswa mampu menyusun kerangka tulisan akademik yang jelas dan terstruktur untuk mendukung publikasi ilmiah.\\"\\n3. Dokumentasikan hasil pekerjaan dengan rapi\\n4. Submit tepat waktu sebelum deadline"}], "rencanaMingguan": [{"materi": "Pengantar Penulisan Ilmiah - Memahami struktur dan komponen dasar penulisan ilmiah.", "metode": "Ceramah, Diskusi", "minggu": 1, "subCpmk": "Sub-CPMK-1", "penilaian": "Quiz"}, {"materi": "Kaidah Bahasa Indonesia Akademik - Mengkaji kaidah-kaidah bahasa dalam penulisan akademik.", "metode": "Ceramah, Praktikum", "minggu": 2, "subCpmk": "Sub-CPMK-2", "penilaian": "Tugas"}, {"materi": "Menyusun Kerangka Tulisan Ilmiah - Penyusunan kerangka sistematis dan logis.", "metode": "Praktikum", "minggu": 3, "subCpmk": "Sub-CPMK-3", "penilaian": "Tugas"}, {"materi": "Identifikasi Topik Penelitian - Merumuskan topik penelitian yang relevan.", "metode": "Diskusi, Kerja Kelompok", "minggu": 4, "subCpmk": "Sub-CPMK-4", "penilaian": "Presentasi"}, {"materi": "Analisis Istilah Teknis - Mengidentifikasi penggunaan istilah teknis dalam laporan sumber daya air.", "metode": "Studi Kasus", "minggu": 5, "subCpmk": "Sub-CPMK-5", "penilaian": "Tugas"}, {"materi": "Kesalahan Bahasa dalam Laporan - Menganalisis kesalahan bahasa dalam laporan sumber daya air.", "metode": "Praktikum", "minggu": 6, "subCpmk": "Sub-CPMK-6", "penilaian": "Tugas"}, {"materi": "Evaluasi Laporan dan Makalah - Teknik menilai penggunaan bahasa dalam laporan dan makalah.", "metode": "Diskusi, Simulasi", "minggu": 7, "subCpmk": "Sub-CPMK-7", "penilaian": "Quiz"}, {"materi": "Penggunaan Istilah Teknis yang Tepat - Analisis penggunaan istilah teknis dalam laporan sumber daya air.", "metode": "Praktikum", "minggu": 9, "subCpmk": "Sub-CPMK-8", "penilaian": "Tugas"}, {"materi": "Laporan Tertulis - Menyusun laporan tentang penggunaan sumber daya air yang ramah lingkungan.", "metode": "Praktikum", "minggu": 10, "subCpmk": "Sub-CPMK-9", "penilaian": "Tugas"}, {"materi": "Penulisan Artikel Ilmiah - Menulis artikel tentang pengelolaan sumber daya air.", "metode": "Praktikum", "minggu": 11, "subCpmk": "Sub-CPMK-10", "penilaian": "Tugas"}, {"materi": "Struktur Artikel Ilmiah - Menulis artikel dengan struktur yang jelas dan logis.", "metode": "Praktikum", "minggu": 12, "subCpmk": "Sub-CPMK-11", "penilaian": "Tugas"}, {"materi": "Analisis Kualitas Sumber Daya Air - Menyusun laporan analisis kualitas dengan data valid.", "metode": "Praktikum", "minggu": 13, "subCpmk": "Sub-CPMK-12", "penilaian": "Tugas"}, {"materi": "Kerangka Tulisan Akademik - Menyusun kerangka tulisan akademik yang sistematis.", "metode": "Praktikum", "minggu": 14, "subCpmk": "Sub-CPMK-13", "penilaian": "Tugas"}]}	\N	\N	2025-12-18 12:10:33.897154+08	2025-12-18 19:33:04.958592+08	\N
\.


--
-- Data for Name: prodis; Type: TABLE DATA; Schema: public; Owner: smart_rps_user
--

COPY public.prodis (id, user_id, kode_prodi, nama_prodi, fakultas, jenjang, email_kaprodi, nama_kaprodi, is_active, created_at, updated_at, deleted_at, program_id) FROM stdin;
cf1f1218-e4f2-4020-b320-70d70b62c8ab	9f878586-ad2a-4f68-8210-2c989b4a6607	S1-TI	S1-INFORMATIKA	Fakultas Teknik	S1	sadasd@gmai.com	asdasdas	t	2025-12-06 17:21:46.855445+08	2025-12-06 17:21:46.855445+08	\N	6b4fb516-28e1-4670-a3ad-81f6270092af
ff30099e-736e-4799-9a3e-040b7b11c573	9e6e66ad-12ac-4325-bc59-bd1afb01403a	s1-sipil	sipil	Fakultas Teknik	S1	sipil@gmail.com	sipil	t	2025-12-06 21:51:30.946895+08	2025-12-06 21:51:30.946895+08	\N	148dd082-8132-460b-b14c-80686e6b231f
c5edd40e-3bfe-486f-a2c6-561c7a029884	24c7a70e-cb7d-4c49-b251-460c31f19f00	832344	elektro	Fakultas Teknik	S1	difah@gmail.com	difa	t	2025-12-07 21:35:15.717362+08	2025-12-07 21:35:15.717362+08	\N	637f777d-594c-4025-9eb3-2d4385f7d1ba
09ebb435-217d-4b3e-99dc-ddb4acbccd55	8d847652-b30b-440f-a6d7-1ad729210825	2312	arsi	Fakultas Teknik	S1	andiariegalang0@gmail.com	ARSI	t	2025-12-07 23:34:32.296659+08	2025-12-07 23:34:32.296659+08	\N	5dfb570c-85b8-4821-af78-c2eb47ac51fb
004feea9-5fb3-408c-9d4b-89e84610902a	268b4f2a-08fd-49bb-8cd9-7d1b942c6e78	34234	perairan 	Fakultas Teknik	S1	105841117422@student.unismuh.ac.id	kamis	t	2025-12-17 22:08:17.568246+08	2025-12-17 22:08:17.568246+08	\N	78fb8b78-111f-4ffa-8396-fe68a3caaff7
\.


--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: smart_rps_user
--

COPY public.programs (id, prodi_id, code, name, created_at, updated_at, deleted_at) FROM stdin;
6b4fb516-28e1-4670-a3ad-81f6270092af	\N	S1-TI	S1-INFORMATIKA	2025-12-06 16:35:55.717044+08	2025-12-06 16:50:37.933143+08	\N
148dd082-8132-460b-b14c-80686e6b231f	\N	s1-sipil	sipil	2025-12-06 21:51:11.515121+08	2025-12-06 21:51:11.515121+08	\N
5dfb570c-85b8-4821-af78-c2eb47ac51fb	\N	2312	arsi	2025-12-07 21:12:32.689203+08	2025-12-07 21:12:32.689203+08	\N
637f777d-594c-4025-9eb3-2d4385f7d1ba	\N	832344	elektro	2025-12-07 21:34:15.10746+08	2025-12-07 21:34:15.10746+08	\N
78fb8b78-111f-4ffa-8396-fe68a3caaff7	\N	34234	perairan 	2025-12-17 22:06:04.585409+08	2025-12-17 22:06:04.585409+08	\N
\.


--
-- Data for Name: sub_cpmk; Type: TABLE DATA; Schema: public; Owner: smart_rps_user
--

COPY public.sub_cpmk (id, cpmk_id, sub_cpmk_number, description, created_at, updated_at, deleted_at) FROM stdin;
9878c7db-ae9f-4f24-afdd-e54ab21b5534	23e81b3a-feb7-433e-aa60-f708f8ed06fa	1	Mampu menghitung limit fungsi satu variabel menggunakan metode aljabar dan grafik.	2025-12-18 19:28:52.665739	2025-12-18 19:28:52.665739	2025-12-18 19:33:14.723556
58ca0e32-b50b-473a-938e-9b13a0f7d572	23e81b3a-feb7-433e-aa60-f708f8ed06fa	2	Mampu menjelaskan definisi limit fungsi dan menghitung limit fungsi sederhana.	2025-12-18 19:28:52.677195	2025-12-18 19:28:52.677195	2025-12-18 19:33:14.723556
55dd3a29-699f-4781-9c5b-b15894ff8f41	23e81b3a-feb7-433e-aa60-f708f8ed06fa	3	Mampu menghitung limit fungsi satu variabel menggunakan definisi epsilon-delta.	2025-12-18 19:28:52.680915	2025-12-18 19:28:52.680915	2025-12-18 19:33:14.723556
ee4c6780-0e8d-4b5e-baa6-d69ab6a133f3	7e075fc4-d1fb-4a03-95f7-b8297c19cecd	4	Menghitung turunan fungsi polinomial dan menerapkannya dalam persoalan teknik sederhana.	2025-12-18 19:28:52.685485	2025-12-18 19:28:52.685485	2025-12-18 19:33:14.7246
adbf8ae1-e674-41c9-9070-18f1a6de8b1a	7e075fc4-d1fb-4a03-95f7-b8297c19cecd	5	Mengidentifikasi dan menerapkan aturan turunan dasar (fungsi konstanta, fungsi pangkat) dalam persoalan teknik.	2025-12-18 19:28:52.689358	2025-12-18 19:28:52.689358	2025-12-18 19:33:14.7246
c73e04cd-a229-43a3-aa2e-1d4f36085ffc	7e075fc4-d1fb-4a03-95f7-b8297c19cecd	6	Mampu menghitung turunan fungsi polinomial dan menerapkannya dalam persoalan teknik sederhana.	2025-12-18 19:28:52.693169	2025-12-18 19:28:52.693169	2025-12-18 19:33:14.7246
61c5e87a-e2ab-4a3b-9756-8991634e4afb	b0409c47-c9d6-43dc-bf46-142c5e2300a1	7	Mengidentifikasi titik stasioner pada grafik fungsi dengan menggunakan turunan pertama.	2025-12-18 19:28:52.697665	2025-12-18 19:28:52.697665	2025-12-18 19:33:14.725121
5bb61b84-6ee9-4efe-ac3d-e9f7da0b75a0	b0409c47-c9d6-43dc-bf46-142c5e2300a1	8	Mengidentifikasi dan menjelaskan sifat-sifat grafik fungsi berdasarkan nilai turunan pertama.	2025-12-18 19:28:52.701142	2025-12-18 19:28:52.701142	2025-12-18 19:33:14.725121
71894d18-0ec9-4104-b8a0-0f93584bdba3	b0409c47-c9d6-43dc-bf46-142c5e2300a1	9	Mengidentifikasi titik kritis dari fungsi menggunakan turunan pertama dan menentukan sifatnya.	2025-12-18 19:28:52.704354	2025-12-18 19:28:52.704354	2025-12-18 19:33:14.725121
875ecd23-85af-44b1-b3f2-e0a9c7e43fe5	163d651d-b93b-48ba-88c1-d18886a5a6e6	10	Menghitung integral tak tentu dari fungsi polinomial derajat satu dan dua.	2025-12-18 19:28:52.709082	2025-12-18 19:28:52.709082	2025-12-18 19:33:14.726167
a82fbab1-b1aa-4342-be4d-2af4f3708c26	163d651d-b93b-48ba-88c1-d18886a5a6e6	11	Mengidentifikasi bentuk umum dari fungsi polinomial yang akan diintegrasi.	2025-12-18 19:28:52.712389	2025-12-18 19:28:52.712389	2025-12-18 19:33:14.726167
6e73c242-c10f-4470-b599-5608dbfe9556	163d651d-b93b-48ba-88c1-d18886a5a6e6	12	Mengidentifikasi dan menyelesaikan integral tak tentu dari fungsi polinomial derajat satu dan dua.	2025-12-18 19:28:52.715401	2025-12-18 19:28:52.715401	2025-12-18 19:33:14.726167
851aed3a-a501-4a4f-92d0-c7f2a4da8ad2	04fb56ee-3e5d-4350-96df-235cb53392c4	13	Mampu mengidentifikasi variabel dan parameter dalam suatu masalah nyata yang dapat dimodelkan secara matematis.	2025-12-18 19:28:52.719612	2025-12-18 19:28:52.719612	2025-12-18 19:33:14.726689
b08ce122-f3c8-4e67-9653-7e061011a5f4	04fb56ee-3e5d-4350-96df-235cb53392c4	14	Mengidentifikasi variabel dan parameter dalam situasi nyata untuk membangun model matematika.	2025-12-18 19:28:52.722994	2025-12-18 19:28:52.722994	2025-12-18 19:33:14.726689
5f75d065-473a-4fe1-9c78-c66a97761a89	23e81b3a-feb7-433e-aa60-f708f8ed06fa	1	Mampu menghitung limit fungsi satu variabel menggunakan metode aljabar dan grafik.	2025-12-18 19:33:14.743347	2025-12-18 19:33:14.743347	\N
83a373fb-2930-4f2c-b4f9-56aff71d0557	23e81b3a-feb7-433e-aa60-f708f8ed06fa	2	Mampu menjelaskan definisi limit fungsi dan menghitung limit fungsi sederhana.	2025-12-18 19:33:14.746479	2025-12-18 19:33:14.746479	\N
99d9753a-ab95-4d72-bad9-71d63312ea45	23e81b3a-feb7-433e-aa60-f708f8ed06fa	3	Mampu menghitung limit fungsi satu variabel menggunakan definisi epsilon-delta.	2025-12-18 19:33:14.750348	2025-12-18 19:33:14.750348	\N
917df582-9685-44cf-8bfd-d9fcca2ee4b7	7e075fc4-d1fb-4a03-95f7-b8297c19cecd	4	Menghitung turunan fungsi polinomial dan menerapkannya dalam persoalan teknik sederhana.	2025-12-18 19:33:14.754888	2025-12-18 19:33:14.754888	\N
b0d74f4a-3835-4fab-8b88-1ce760bf3dea	7e075fc4-d1fb-4a03-95f7-b8297c19cecd	5	Mengidentifikasi dan menerapkan aturan turunan dasar (fungsi konstanta, fungsi pangkat) dalam persoalan teknik.	2025-12-18 19:33:14.758276	2025-12-18 19:33:14.758276	\N
b5ee7768-8488-4c52-81f1-c70cae570e18	7e075fc4-d1fb-4a03-95f7-b8297c19cecd	6	Mampu menghitung turunan fungsi polinomial dan menerapkannya dalam persoalan teknik sederhana.	2025-12-18 19:33:14.761333	2025-12-18 19:33:14.761333	\N
e98620f3-d638-477e-8569-e3a570c34d53	b0409c47-c9d6-43dc-bf46-142c5e2300a1	7	Mengidentifikasi titik stasioner pada grafik fungsi dengan menggunakan turunan pertama.	2025-12-18 19:33:14.765864	2025-12-18 19:33:14.765864	\N
3c6eb213-3442-4a29-8daf-71ccf83054ba	b0409c47-c9d6-43dc-bf46-142c5e2300a1	8	Mengidentifikasi dan menjelaskan sifat-sifat grafik fungsi berdasarkan nilai turunan pertama.	2025-12-18 19:33:14.769311	2025-12-18 19:33:14.769311	\N
ff61165c-f072-492f-bbf0-9d32102ac21e	b0409c47-c9d6-43dc-bf46-142c5e2300a1	9	Mengidentifikasi titik kritis dari fungsi menggunakan turunan pertama dan menentukan sifatnya.	2025-12-18 19:33:14.772597	2025-12-18 19:33:14.772597	\N
72be58d3-6ee6-4d7c-9c25-8f0158a59b9d	163d651d-b93b-48ba-88c1-d18886a5a6e6	10	Menghitung integral tak tentu dari fungsi polinomial derajat satu dan dua.	2025-12-18 19:33:14.776465	2025-12-18 19:33:14.776465	\N
0b1db374-69a9-41a9-8d71-163b2c3c40c6	163d651d-b93b-48ba-88c1-d18886a5a6e6	11	Mengidentifikasi bentuk umum dari fungsi polinomial yang akan diintegrasi.	2025-12-18 19:33:14.779674	2025-12-18 19:33:14.779674	\N
0d640ef4-13ff-434f-8b0b-e3d0eefaf98d	163d651d-b93b-48ba-88c1-d18886a5a6e6	12	Mengidentifikasi dan menyelesaikan integral tak tentu dari fungsi polinomial derajat satu dan dua.	2025-12-18 19:33:14.782797	2025-12-18 19:33:14.782797	\N
fe7362ff-db21-4ef6-906f-dc2cd2c03712	04fb56ee-3e5d-4350-96df-235cb53392c4	13	Mampu mengidentifikasi variabel dan parameter dalam suatu masalah nyata yang dapat dimodelkan secara matematis.	2025-12-18 19:33:14.787193	2025-12-18 19:33:14.787193	\N
3ef5cfbe-52af-4e7b-b89c-93174251b0d3	04fb56ee-3e5d-4350-96df-235cb53392c4	14	Mengidentifikasi variabel dan parameter dalam situasi nyata untuk membangun model matematika.	2025-12-18 19:33:14.790377	2025-12-18 19:33:14.790377	\N
3664e397-ad2c-4724-9cfb-cc1604b2fe7d	7fdba7d2-7d46-42bd-9f03-ffcb32635b07	1	Mahasiswa mampu mengidentifikasi dan merumuskan topik penelitian yang relevan dan menarik dalam konteks akademik.	2025-12-18 19:30:19.179801	2025-12-18 19:30:19.179801	2025-12-18 19:35:40.548691
62eaae97-0a1f-4527-a5f1-07a8ebd2bb32	7fdba7d2-7d46-42bd-9f03-ffcb32635b07	2	Mahasiswa mampu mengidentifikasi dan merumuskan topik penelitian yang relevan dan menarik untuk tulisan ilmiah.	2025-12-18 19:30:19.184626	2025-12-18 19:30:19.184626	2025-12-18 19:35:40.548691
ce0d816f-27f2-4b4f-83ce-f5723c673a70	7fdba7d2-7d46-42bd-9f03-ffcb32635b07	3	Mahasiswa mampu menyusun kerangka tulisan ilmiah yang sistematis dan logis.	2025-12-18 19:30:19.189801	2025-12-18 19:30:19.189801	2025-12-18 19:35:40.548691
05633091-5d08-423c-8c26-529f478cf107	7fdba7d2-7d46-42bd-9f03-ffcb32635b07	4	Mahasiswa mampu merumuskan topik penelitian yang relevan dan menarik untuk tulisan ilmiah.	2025-12-18 19:30:19.193631	2025-12-18 19:30:19.193631	2025-12-18 19:35:40.548691
dd045911-8d73-42a5-928f-379b0b14cb2f	e3ed5bc2-5a06-4468-9afc-9f0f1fd3299c	5	Mahasiswa mampu mengidentifikasi dan menganalisis penggunaan istilah teknis dalam laporan sumber daya air.	2025-12-18 19:30:19.198417	2025-12-18 19:30:19.198417	2025-12-18 19:35:40.55229
589b5711-7649-471a-b3dc-de0692dc3505	e3ed5bc2-5a06-4468-9afc-9f0f1fd3299c	6	Mahasiswa mampu mengidentifikasi dan menganalisis kesalahan bahasa dalam laporan sumber daya air.	2025-12-18 19:30:19.202381	2025-12-18 19:30:19.202381	2025-12-18 19:35:40.55229
5e184cbf-a8bf-4e84-bcee-6a9728b76c75	e3ed5bc2-5a06-4468-9afc-9f0f1fd3299c	7	Mahasiswa mampu mengidentifikasi kesalahan penggunaan bahasa dalam laporan sumber daya air.	2025-12-18 19:30:19.206872	2025-12-18 19:30:19.206872	2025-12-18 19:35:40.55229
001ffe0b-d29c-49ea-aaec-f5e4a778c6f3	e3ed5bc2-5a06-4468-9afc-9f0f1fd3299c	8	Mahasiswa mampu mengidentifikasi dan menganalisis penggunaan istilah teknis yang tepat dalam laporan sumber daya air.	2025-12-18 19:30:19.210408	2025-12-18 19:30:19.210408	2025-12-18 19:35:40.55229
a4f5366f-af7f-4c9a-ba4c-bb9c108014e3	27058dec-7b69-4b7b-b471-cc1b28b4f71b	9	Mahasiswa dapat menyusun laporan tertulis mengenai penggunaan sumber daya air yang ramah lingkungan.	2025-12-18 19:30:19.214731	2025-12-18 19:30:19.214731	2025-12-18 19:35:40.553343
dc659345-4713-4550-a734-45a8ae0f5c8b	27058dec-7b69-4b7b-b471-cc1b28b4f71b	10	Mahasiswa mampu menulis artikel ilmiah tentang pengelolaan sumber daya air dengan struktur yang jelas dan argumentasi yang logis.	2025-12-18 19:30:19.218206	2025-12-18 19:30:19.218206	2025-12-18 19:35:40.553343
aec0211f-ffdc-439f-8a3c-4bd69e9765e9	27058dec-7b69-4b7b-b471-cc1b28b4f71b	11	Mahasiswa dapat menulis artikel tentang pengelolaan sumber daya air dengan struktur yang jelas dan logis.	2025-12-18 19:30:19.222729	2025-12-18 19:30:19.222729	2025-12-18 19:35:40.553343
64bae874-97dc-4cd2-9632-fe6244bf296d	27058dec-7b69-4b7b-b471-cc1b28b4f71b	12	Mahasiswa mampu menyusun laporan tertulis tentang analisis kualitas sumber daya air dengan menggunakan data dan referensi yang valid.	2025-12-18 19:30:19.226626	2025-12-18 19:30:19.226626	2025-12-18 19:35:40.553343
2d613c04-65e8-42df-9d09-443b32d5d48c	613bdbcb-4e2a-410c-ab43-051f3fb84657	13	Mahasiswa mampu menyusun kerangka tulisan akademik yang sistematis dan logis.	2025-12-18 19:30:19.231014	2025-12-18 19:30:19.231014	2025-12-18 19:35:40.553852
fbc98291-c25b-4e8b-b026-04753ec69d6c	613bdbcb-4e2a-410c-ab43-051f3fb84657	14	Mahasiswa mampu menyusun kerangka tulisan akademik yang jelas dan terstruktur untuk mendukung publikasi ilmiah.	2025-12-18 19:30:19.234368	2025-12-18 19:30:19.234368	2025-12-18 19:35:40.553852
1dc00886-0af9-4cfd-9820-a5e4ecdbdd7d	7fdba7d2-7d46-42bd-9f03-ffcb32635b07	1	Mahasiswa mampu mengidentifikasi dan merumuskan topik penelitian yang relevan dan menarik dalam konteks akademik.	2025-12-18 19:35:40.569538	2025-12-18 19:35:40.569538	\N
032ec019-8b31-4033-941f-7043f044528a	7fdba7d2-7d46-42bd-9f03-ffcb32635b07	2	Mahasiswa mampu mengidentifikasi dan merumuskan topik penelitian yang relevan dan menarik untuk tulisan ilmiah.	2025-12-18 19:35:40.572992	2025-12-18 19:35:40.572992	\N
5a391f2c-485b-448a-9f65-3b44f646b8e5	7fdba7d2-7d46-42bd-9f03-ffcb32635b07	3	Mahasiswa mampu menyusun kerangka tulisan ilmiah yang sistematis dan logis.	2025-12-18 19:35:40.57606	2025-12-18 19:35:40.57606	\N
dc7ebb1d-5fe0-40f3-be66-324bec662880	7fdba7d2-7d46-42bd-9f03-ffcb32635b07	4	Mahasiswa mampu merumuskan topik penelitian yang relevan dan menarik untuk tulisan ilmiah.	2025-12-18 19:35:40.579338	2025-12-18 19:35:40.579338	\N
b10165b3-bdb9-4054-be5d-80892e738dd8	e3ed5bc2-5a06-4468-9afc-9f0f1fd3299c	5	Mahasiswa mampu mengidentifikasi dan menganalisis penggunaan istilah teknis dalam laporan sumber daya air.	2025-12-18 19:35:40.584162	2025-12-18 19:35:40.584162	\N
206e27ed-c884-45e9-8f2f-e24ca9c634ef	e3ed5bc2-5a06-4468-9afc-9f0f1fd3299c	6	Mahasiswa mampu mengidentifikasi dan menganalisis kesalahan bahasa dalam laporan sumber daya air.	2025-12-18 19:35:40.587739	2025-12-18 19:35:40.587739	\N
abd491d7-f9f7-475b-bc1e-59853e06364b	e3ed5bc2-5a06-4468-9afc-9f0f1fd3299c	7	Mahasiswa mampu mengidentifikasi kesalahan penggunaan bahasa dalam laporan sumber daya air.	2025-12-18 19:35:40.591049	2025-12-18 19:35:40.591049	\N
55bbe934-5c0e-4cef-81d8-9b3651b441aa	e3ed5bc2-5a06-4468-9afc-9f0f1fd3299c	8	Mahasiswa mampu mengidentifikasi dan menganalisis penggunaan istilah teknis yang tepat dalam laporan sumber daya air.	2025-12-18 19:35:40.59446	2025-12-18 19:35:40.59446	\N
792dfe60-15ad-475e-b6d6-3a3e5d506408	27058dec-7b69-4b7b-b471-cc1b28b4f71b	9	Mahasiswa dapat menyusun laporan tertulis mengenai penggunaan sumber daya air yang ramah lingkungan.	2025-12-18 19:35:40.599835	2025-12-18 19:35:40.599835	\N
cd0cc9b8-dbcb-4729-a3b0-70831fd3c717	27058dec-7b69-4b7b-b471-cc1b28b4f71b	10	Mahasiswa mampu menulis artikel ilmiah tentang pengelolaan sumber daya air dengan struktur yang jelas dan argumentasi yang logis.	2025-12-18 19:35:40.60328	2025-12-18 19:35:40.60328	\N
d07401b0-c5f4-45e7-9e96-77a8d9ef1c66	27058dec-7b69-4b7b-b471-cc1b28b4f71b	11	Mahasiswa dapat menulis artikel tentang pengelolaan sumber daya air dengan struktur yang jelas dan logis.	2025-12-18 19:35:40.606438	2025-12-18 19:35:40.606438	\N
d37b7281-5f92-405a-ba8e-f90567e86319	27058dec-7b69-4b7b-b471-cc1b28b4f71b	12	Mahasiswa mampu menyusun laporan tertulis tentang analisis kualitas sumber daya air dengan menggunakan data dan referensi yang valid.	2025-12-18 19:35:40.609623	2025-12-18 19:35:40.609623	\N
9747a7b1-c6b2-4d71-b958-24d0a4c43a0e	613bdbcb-4e2a-410c-ab43-051f3fb84657	13	Mahasiswa mampu menyusun kerangka tulisan akademik yang sistematis dan logis.	2025-12-18 19:35:40.613962	2025-12-18 19:35:40.613962	\N
7db8f9b1-536d-44fd-882c-06717c686b2c	613bdbcb-4e2a-410c-ab43-051f3fb84657	14	Mahasiswa mampu menyusun kerangka tulisan akademik yang jelas dan terstruktur untuk mendukung publikasi ilmiah.	2025-12-18 19:35:40.61751	2025-12-18 19:35:40.61751	\N
e4afe5b6-eb14-421f-b31b-4760be2ad13d	e2823eb9-aa8d-408a-9d67-1b948992e2ca	1	Mengidentifikasi dan menjelaskan prinsip-prinsip etika dalam ajaran Islam berdasarkan sumber-sumber utama seperti Al-Qur'an dan Hadis.	2025-12-18 19:35:56.758921	2025-12-18 19:35:56.758921	\N
88f50def-eb5d-48ed-967e-90a101c3c421	e2823eb9-aa8d-408a-9d67-1b948992e2ca	2	Mengidentifikasi dan menjelaskan konsep dasar etika dalam Islam serta peranannya dalam kehidupan sehari-hari.	2025-12-18 19:35:56.762416	2025-12-18 19:35:56.762416	\N
5a9c29e2-3f59-4116-8abd-b306f014ed42	e2823eb9-aa8d-408a-9d67-1b948992e2ca	3	Mengidentifikasi dan menjelaskan sumber-sumber ajaran Islam yang membahas etika dan akhlak.	2025-12-18 19:35:56.766529	2025-12-18 19:35:56.766529	\N
de13c224-eace-4b6a-b69f-c92a76d6d099	e2823eb9-aa8d-408a-9d67-1b948992e2ca	4	Mengidentifikasi dan menjelaskan nilai-nilai etika dalam ajaran Islam yang berkaitan dengan perilaku sehari-hari.	2025-12-18 19:35:56.769888	2025-12-18 19:35:56.769888	\N
68a02336-4156-4498-a58a-2964d094ea7a	cc5029b1-5d47-4817-ac16-7fec41362a79	5	Mahasiswa dapat mengidentifikasi dan menjelaskan nilai-nilai keislaman yang relevan dalam konteks akademik.	2025-12-18 19:35:56.774478	2025-12-18 19:35:56.774478	\N
671cf1a5-1d50-40f9-842a-bf9984ef6676	cc5029b1-5d47-4817-ac16-7fec41362a79	6	Mahasiswa mampu menjelaskan prinsip-prinsip keislaman yang relevan dengan etika akademik dalam tugas dan interaksi sehari-hari.	2025-12-18 19:35:56.77805	2025-12-18 19:35:56.77805	\N
54c2b209-6e66-4a85-a516-27d33b5c7e9e	cc5029b1-5d47-4817-ac16-7fec41362a79	7	Mahasiswa dapat menjelaskan prinsip-prinsip keislaman yang relevan dalam konteks akademik dan kehidupan sehari-hari.	2025-12-18 19:35:56.782361	2025-12-18 19:35:56.782361	\N
51793682-b286-49f5-8d5d-f233f9cdbb63	cc5029b1-5d47-4817-ac16-7fec41362a79	8	Mahasiswa mampu menjelaskan prinsip-prinsip dasar nilai keislaman yang relevan dengan perilaku akademik.	2025-12-18 19:35:56.785796	2025-12-18 19:35:56.785796	\N
257633e1-e5f3-49b7-88ec-3731c034c1c2	c19e8c80-4179-4f23-81ec-0fca1338eac1	9	Mahasiswa mampu menjelaskan prinsip-prinsip ajaran Islam yang relevan dengan praktik teknik pengairan di masyarakat.	2025-12-18 19:35:56.790171	2025-12-18 19:35:56.790171	\N
8f91d6ab-19ca-4b60-96c2-06a18ea039dd	c19e8c80-4179-4f23-81ec-0fca1338eac1	10	Mahasiswa dapat menjelaskan prinsip-prinsip dasar ajaran Islam yang relevan dengan praktik teknik pengairan.	2025-12-18 19:35:56.793969	2025-12-18 19:35:56.793969	\N
694d1094-b6c2-4e4f-999d-114e0b0a625b	c19e8c80-4179-4f23-81ec-0fca1338eac1	11	Mahasiswa mampu menganalisis nilai-nilai Islam yang relevan dengan praktik pengairan dalam konteks masyarakat lokal.	2025-12-18 19:35:56.798896	2025-12-18 19:35:56.798896	\N
988d89e7-ae3c-42f8-b790-450223355785	c19e8c80-4179-4f23-81ec-0fca1338eac1	12	Mahasiswa dapat menjelaskan prinsip-prinsip ajaran Islam yang relevan dengan pengelolaan sumber daya air dalam konteks sosial dan budaya setempat.	2025-12-18 19:35:56.802408	2025-12-18 19:35:56.802408	\N
9fe69d10-455e-4fa8-b363-49995f4a6447	5167cbdd-d5b2-41f5-a245-d2e1d87ff63f	13	Mahasiswa mampu mengidentifikasi dan menjelaskan prinsip-prinsip keberlanjutan dalam konteks ajaran Islam.	2025-12-18 19:35:56.806516	2025-12-18 19:35:56.806516	\N
9bfb3875-82e1-4523-a908-2943697fd79f	5167cbdd-d5b2-41f5-a245-d2e1d87ff63f	14	Mahasiswa mampu menjelaskan konsep keberlanjutan dalam konteks ajaran Islam dan aplikasinya dalam kehidupan sehari-hari.	2025-12-18 19:35:56.809751	2025-12-18 19:35:56.809751	\N
9705e0b3-7265-40e5-b077-2a83a5c9ff63	15115554-2123-4b20-9e18-02cae291b92d	1	Mahasiswa mampu mengidentifikasi dan menjelaskan lima nilai dasar Pancasila dalam konteks kehidupan sosial masyarakat.	2025-12-18 19:36:06.823627	2025-12-18 19:36:06.823627	\N
f8e85a92-21d0-4bb5-a16e-d04f9f884a38	15115554-2123-4b20-9e18-02cae291b92d	2	Mahasiswa mampu mendeskripsikan nilai-nilai dasar Pancasila dan implementasinya dalam kehidupan sehari-hari.	2025-12-18 19:36:06.829023	2025-12-18 19:36:06.829023	\N
988fc87c-1a81-4b42-ba10-fb3d5859e3f3	15115554-2123-4b20-9e18-02cae291b92d	3	Mahasiswa mampu mengidentifikasi dan menjelaskan nilai-nilai dasar Pancasila dalam konteks kehidupan sehari-hari.	2025-12-18 19:36:06.833676	2025-12-18 19:36:06.833676	\N
8a649eea-ea41-49be-91eb-e80178ba558a	15115554-2123-4b20-9e18-02cae291b92d	4	Mahasiswa mampu mengidentifikasi dan menjelaskan lima nilai utama Pancasila serta relevansinya dalam kehidupan sehari-hari.	2025-12-18 19:36:06.838159	2025-12-18 19:36:06.838159	\N
3cbe4e0d-b0ee-444a-94b9-c930f908181f	928ec3bc-a137-477a-b4d0-973a3f072708	5	Mahasiswa mampu mengidentifikasi dan mendeskripsikan persoalan sosial yang relevan dengan prinsip etika Pancasila dalam konteks masyarakat saat ini.	2025-12-18 19:36:06.843277	2025-12-18 19:36:06.843277	\N
7d80b289-ff20-467f-b183-f08993a990c3	928ec3bc-a137-477a-b4d0-973a3f072708	6	Mahasiswa dapat mengidentifikasi dan menjelaskan persoalan sosial yang relevan dengan nilai-nilai Pancasila.	2025-12-18 19:36:06.848105	2025-12-18 19:36:06.848105	\N
d8b7c11b-706a-44d9-81f2-e3675ae7d55f	928ec3bc-a137-477a-b4d0-973a3f072708	7	Mahasiswa dapat mengidentifikasi dan mendeskripsikan persoalan sosial yang relevan dengan nilai-nilai Pancasila.	2025-12-18 19:36:06.85218	2025-12-18 19:36:06.85218	\N
8ed00787-0de9-4149-9938-1e4c096bcd6f	928ec3bc-a137-477a-b4d0-973a3f072708	8	Mahasiswa mampu mengidentifikasi dan merumuskan persoalan sosial yang relevan dengan nilai-nilai Pancasila.	2025-12-18 19:36:06.855798	2025-12-18 19:36:06.855798	\N
82ee483b-98f4-4b78-8bd3-d454a26e51a5	cc2a1b75-7c79-4184-9538-0af291f9ee28	9	Mahasiswa mampu mengidentifikasi dan menjelaskan nilai-nilai Pancasila yang berhubungan dengan integritas dan moralitas dalam kehidupan sehari-hari.	2025-12-18 19:36:06.861041	2025-12-18 19:36:06.861041	\N
e59d3698-1b39-4436-af2f-3ae14a12bba0	cc2a1b75-7c79-4184-9538-0af291f9ee28	10	Mahasiswa dapat menjelaskan konsep integritas dan moralitas dalam konteks Pancasila dan aplikasinya dalam kehidupan sehari-hari.	2025-12-18 19:36:06.865424	2025-12-18 19:36:06.865424	\N
2c2472e7-961c-4810-90a9-1310c776981e	cc2a1b75-7c79-4184-9538-0af291f9ee28	11	Mahasiswa dapat menjelaskan konsep integritas dan moralitas dalam konteks Pancasila secara tertulis.	2025-12-18 19:36:06.869286	2025-12-18 19:36:06.869286	\N
97281ab3-095d-4d50-bfb9-d88cbf0076b3	cc2a1b75-7c79-4184-9538-0af291f9ee28	12	Mahasiswa dapat menjelaskan konsep integritas dan moralitas dalam konteks Pancasila dan penerapannya dalam kehidupan sehari-hari.	2025-12-18 19:36:06.873253	2025-12-18 19:36:06.873253	\N
5dc71978-9365-4f1d-8f26-6f2097a15eca	bd1af714-ab16-4c7c-9771-ea24395aa22e	13	Mahasiswa dapat mengidentifikasi dan menjelaskan nilai-nilai Pancasila yang relevan dalam situasi pengambilan keputusan.	2025-12-18 19:36:06.878129	2025-12-18 19:36:06.878129	\N
bad312b8-f4f7-401f-a259-bbe33b6fa5e7	bd1af714-ab16-4c7c-9771-ea24395aa22e	14	Mahasiswa mampu mengidentifikasi dan menganalisis kasus-kasus pengambilan keputusan yang mencerminkan nilai-nilai Pancasila dalam konteks sosial dan ekonomi.	2025-12-18 19:36:06.882621	2025-12-18 19:36:06.882621	\N
\.


--
-- Data for Name: template_versions; Type: TABLE DATA; Schema: public; Owner: smart_rps_user
--

COPY public.template_versions (id, template_id, version, definition, created_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: templates; Type: TABLE DATA; Schema: public; Owner: smart_rps_user
--

COPY public.templates (id, program_id, name, description, created_by, is_active, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: smart_rps_user
--

COPY public.users (id, username, password, email, display_name, role, created_at, updated_at, deleted_at) FROM stdin;
8d847652-b30b-440f-a6d7-1ad729210825	arsi123	$2a$10$jDB/UFnE19liOziv/Ck6Ke9frbe4Jjz5uiJR7golbcKseqA7CrNg.	andiariegalang0@gmail.com	ARSI	kaprodi	2025-12-07 23:34:32.295152+08	2025-12-07 23:34:32.295152+08	\N
ebbe3ce3-a2ec-4ea1-afd5-7579e7278f4f	dosen1	$2a$10$HbTjuGWhVjUhzxyo2fsDRevRsjM5N.UBmNfpDjYL.ewvd841lOThu	andiariegalang@gmail.com	galang	dosen	2025-12-07 01:59:45.20619+08	2025-12-07 01:59:45.20619+08	2025-12-17 17:55:55.9058+08
268b4f2a-08fd-49bb-8cd9-7d1b942c6e78	kamis	$2a$10$gGSDBVYP1oW/jnS22a88AeiizrIlHXBzs29sZdyPESyeIyEiI4zcG	105841117422@student.unismuh.ac.id	kamis	kaprodi	2025-12-17 22:08:17.558126+08	2025-12-18 20:04:59.979375+08	\N
a96ee0c0-5f8e-4cef-a7dd-99056efda013	admin	$2a$10$JLH/BWiTuC5tdaL1m4guJudAcbu806VbVE3L5qa./udmvF0dVIrqW	admin@smartrps.com	Administrator	admin	2025-12-06 17:20:07.540524+08	2025-12-06 17:20:07.540524+08	\N
9f878586-ad2a-4f68-8210-2c989b4a6607	galang	$2a$10$LSI/ZxyHkvApc8iYW227.uK16Pm386DPhfLt2H0i/UhXSJbzzSvl6	sadasd@gmai.com	asdasdas	kaprodi	2025-12-06 17:21:46.852938+08	2025-12-06 17:21:46.852938+08	\N
9e6e66ad-12ac-4325-bc59-bd1afb01403a	sipil	$2a$10$CzuO3hVgQ0T7tB0PB9Y/2eohEd8d1OySigtQWv3SGh/I59syht/Yy	sipil@gmail.com	sipil	kaprodi	2025-12-06 21:51:30.94538+08	2025-12-06 21:51:30.94538+08	\N
24c7a70e-cb7d-4c49-b251-460c31f19f00	difah	$2a$10$PvGaLEu6FyWzICskY1Ukc.UlhH3Xeah9ocDSYdbV9un.0nVU3eaQG	difah@gmail.com	difa	kaprodi	2025-12-07 21:35:15.715855+08	2025-12-07 21:35:15.715855+08	\N
\.


--
-- Name: courses courses_code_key; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_code_key UNIQUE (code);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: cpl_indikator cpl_indikator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpl_indikator
    ADD CONSTRAINT cpl_indikator_pkey PRIMARY KEY (id);


--
-- Name: cpl cpl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpl
    ADD CONSTRAINT cpl_pkey PRIMARY KEY (id);


--
-- Name: cpmk cpmk_pkey; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.cpmk
    ADD CONSTRAINT cpmk_pkey PRIMARY KEY (id);


--
-- Name: dosen_courses dosen_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosen_courses
    ADD CONSTRAINT dosen_courses_pkey PRIMARY KEY (dosen_id, course_id);


--
-- Name: dosen_rps_access dosen_rps_access_pkey; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosen_rps_access
    ADD CONSTRAINT dosen_rps_access_pkey PRIMARY KEY (id);


--
-- Name: dosen_rps_accesses dosen_rps_accesses_pkey; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosen_rps_accesses
    ADD CONSTRAINT dosen_rps_accesses_pkey PRIMARY KEY (id);


--
-- Name: dosens dosens_email_key; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosens
    ADD CONSTRAINT dosens_email_key UNIQUE (email);


--
-- Name: dosens dosens_n_id_n_key; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosens
    ADD CONSTRAINT dosens_n_id_n_key UNIQUE (n_id_n);


--
-- Name: dosens dosens_pkey; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosens
    ADD CONSTRAINT dosens_pkey PRIMARY KEY (id);


--
-- Name: generated_rps generated_rps_pkey; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.generated_rps
    ADD CONSTRAINT generated_rps_pkey PRIMARY KEY (id);


--
-- Name: prodis prodis_kode_prodi_key; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.prodis
    ADD CONSTRAINT prodis_kode_prodi_key UNIQUE (kode_prodi);


--
-- Name: prodis prodis_pkey; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.prodis
    ADD CONSTRAINT prodis_pkey PRIMARY KEY (id);


--
-- Name: programs programs_code_key; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_code_key UNIQUE (code);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: sub_cpmk sub_cpmk_pkey; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.sub_cpmk
    ADD CONSTRAINT sub_cpmk_pkey PRIMARY KEY (id);


--
-- Name: template_versions template_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.template_versions
    ADD CONSTRAINT template_versions_pkey PRIMARY KEY (id);


--
-- Name: templates templates_pkey; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT templates_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_courses_deleted_at; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_courses_deleted_at ON public.courses USING btree (deleted_at);


--
-- Name: idx_courses_program_id; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_courses_program_id ON public.courses USING btree (program_id);


--
-- Name: idx_cpl_indikator_cpl_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cpl_indikator_cpl_id ON public.cpl_indikator USING btree (cpl_id);


--
-- Name: idx_cpl_kode_cpl; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cpl_kode_cpl ON public.cpl USING btree (kode_cpl);


--
-- Name: idx_cpl_prodi_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cpl_prodi_id ON public.cpl USING btree (prodi_id);


--
-- Name: idx_cpmk_course_id; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_cpmk_course_id ON public.cpmk USING btree (course_id);


--
-- Name: idx_dosen_rps_access_dosen_id; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_dosen_rps_access_dosen_id ON public.dosen_rps_access USING btree (dosen_id);


--
-- Name: idx_dosen_rps_accesses_deleted_at; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_dosen_rps_accesses_deleted_at ON public.dosen_rps_accesses USING btree (deleted_at);


--
-- Name: idx_dosens_deleted_at; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_dosens_deleted_at ON public.dosens USING btree (deleted_at);


--
-- Name: idx_generated_rps_course_id; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_generated_rps_course_id ON public.generated_rps USING btree (course_id);


--
-- Name: idx_generated_rps_deleted_at; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_generated_rps_deleted_at ON public.generated_rps USING btree (deleted_at);


--
-- Name: idx_prodis_deleted_at; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_prodis_deleted_at ON public.prodis USING btree (deleted_at);


--
-- Name: idx_prodis_kode_prodi; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_prodis_kode_prodi ON public.prodis USING btree (kode_prodi);


--
-- Name: idx_programs_code; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_programs_code ON public.programs USING btree (code);


--
-- Name: idx_programs_deleted_at; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_programs_deleted_at ON public.programs USING btree (deleted_at);


--
-- Name: idx_sub_cpmk_cpmk_id; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_sub_cpmk_cpmk_id ON public.sub_cpmk USING btree (cpmk_id);


--
-- Name: idx_template_versions_deleted_at; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_template_versions_deleted_at ON public.template_versions USING btree (deleted_at);


--
-- Name: idx_templates_deleted_at; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_templates_deleted_at ON public.templates USING btree (deleted_at);


--
-- Name: idx_templates_program_id; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_templates_program_id ON public.templates USING btree (program_id);


--
-- Name: idx_users_deleted_at; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_users_deleted_at ON public.users USING btree (deleted_at);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: smart_rps_user
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: cpl_indikator cpl_indikator_cpl_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpl_indikator
    ADD CONSTRAINT cpl_indikator_cpl_id_fkey FOREIGN KEY (cpl_id) REFERENCES public.cpl(id) ON DELETE CASCADE;


--
-- Name: cpl cpl_prodi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cpl
    ADD CONSTRAINT cpl_prodi_id_fkey FOREIGN KEY (prodi_id) REFERENCES public.prodis(id);


--
-- Name: cpmk cpmk_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.cpmk
    ADD CONSTRAINT cpmk_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: dosen_rps_access dosen_rps_access_dosen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosen_rps_access
    ADD CONSTRAINT dosen_rps_access_dosen_id_fkey FOREIGN KEY (dosen_id) REFERENCES public.dosens(id);


--
-- Name: dosen_rps_access dosen_rps_access_generated_rps_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosen_rps_access
    ADD CONSTRAINT dosen_rps_access_generated_rps_id_fkey FOREIGN KEY (generated_rps_id) REFERENCES public.generated_rps(id);


--
-- Name: dosen_rps_access dosen_rps_access_granted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosen_rps_access
    ADD CONSTRAINT dosen_rps_access_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES public.users(id);


--
-- Name: courses fk_courses_prodi; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT fk_courses_prodi FOREIGN KEY (prodi_id) REFERENCES public.prodis(id);


--
-- Name: courses fk_courses_program; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT fk_courses_program FOREIGN KEY (program_id) REFERENCES public.programs(id);


--
-- Name: dosen_courses fk_dosen_courses_course; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosen_courses
    ADD CONSTRAINT fk_dosen_courses_course FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: dosen_courses fk_dosen_courses_dosen; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosen_courses
    ADD CONSTRAINT fk_dosen_courses_dosen FOREIGN KEY (dosen_id) REFERENCES public.dosens(id);


--
-- Name: dosen_rps_accesses fk_dosen_rps_accesses_dosen; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosen_rps_accesses
    ADD CONSTRAINT fk_dosen_rps_accesses_dosen FOREIGN KEY (dosen_id) REFERENCES public.dosens(id);


--
-- Name: dosen_rps_accesses fk_dosen_rps_accesses_generated_rps; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosen_rps_accesses
    ADD CONSTRAINT fk_dosen_rps_accesses_generated_rps FOREIGN KEY (generated_rps_id) REFERENCES public.generated_rps(id);


--
-- Name: dosen_rps_accesses fk_dosen_rps_accesses_granter; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosen_rps_accesses
    ADD CONSTRAINT fk_dosen_rps_accesses_granter FOREIGN KEY (granted_by) REFERENCES public.users(id);


--
-- Name: dosens fk_dosens_prodi; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosens
    ADD CONSTRAINT fk_dosens_prodi FOREIGN KEY (prodi_id) REFERENCES public.prodis(id);


--
-- Name: dosens fk_dosens_user; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.dosens
    ADD CONSTRAINT fk_dosens_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: generated_rps fk_generated_rps_course; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.generated_rps
    ADD CONSTRAINT fk_generated_rps_course FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: generated_rps fk_generated_rps_generator; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.generated_rps
    ADD CONSTRAINT fk_generated_rps_generator FOREIGN KEY (generated_by) REFERENCES public.users(id);


--
-- Name: generated_rps fk_generated_rps_template_version; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.generated_rps
    ADD CONSTRAINT fk_generated_rps_template_version FOREIGN KEY (template_version_id) REFERENCES public.template_versions(id);


--
-- Name: prodis fk_prodis_program; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.prodis
    ADD CONSTRAINT fk_prodis_program FOREIGN KEY (program_id) REFERENCES public.programs(id);


--
-- Name: prodis fk_prodis_programs; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.prodis
    ADD CONSTRAINT fk_prodis_programs FOREIGN KEY (program_id) REFERENCES public.programs(id) ON DELETE SET NULL;


--
-- Name: prodis fk_prodis_user; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.prodis
    ADD CONSTRAINT fk_prodis_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: programs fk_programs_prodi; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT fk_programs_prodi FOREIGN KEY (prodi_id) REFERENCES public.prodis(id);


--
-- Name: template_versions fk_template_versions_creator; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.template_versions
    ADD CONSTRAINT fk_template_versions_creator FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: template_versions fk_template_versions_template; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.template_versions
    ADD CONSTRAINT fk_template_versions_template FOREIGN KEY (template_id) REFERENCES public.templates(id);


--
-- Name: templates fk_templates_creator; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT fk_templates_creator FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: templates fk_templates_program; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT fk_templates_program FOREIGN KEY (program_id) REFERENCES public.programs(id);


--
-- Name: generated_rps generated_rps_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.generated_rps
    ADD CONSTRAINT generated_rps_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: sub_cpmk sub_cpmk_cpmk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: smart_rps_user
--

ALTER TABLE ONLY public.sub_cpmk
    ADD CONSTRAINT sub_cpmk_cpmk_id_fkey FOREIGN KEY (cpmk_id) REFERENCES public.cpmk(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO smart_rps_user;


--
-- Name: TABLE cpl; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cpl TO smart_rps_user;


--
-- Name: TABLE cpl_indikator; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cpl_indikator TO smart_rps_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO smart_rps_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO smart_rps_user;


--
-- PostgreSQL database dump complete
--

\unrestrict t3dwXrEnBTlbU6GNaMiVn03icqY1WZYhIdRwyewVZqdkTvB0giVxbkBorRAdICf

