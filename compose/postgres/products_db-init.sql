--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4
-- Dumped by pg_dump version 14.4

-- Started on 2024-05-10 11:38:03

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

--
-- TOC entry 830 (class 1247 OID 26458)
-- Name: Estado; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Estado" AS ENUM (
    'NUEVO',
    'USADO'
);


ALTER TYPE public."Estado" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 26491)
-- Name: Categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Categoria" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Categoria" OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 26490)
-- Name: Categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Categoria_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Categoria_id_seq" OWNER TO postgres;

--
-- TOC entry 3352 (class 0 OID 0)
-- Dependencies: 213
-- Name: Categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Categoria_id_seq" OWNED BY public."Categoria".id;


--
-- TOC entry 211 (class 1259 OID 26474)
-- Name: Producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Producto" (
    id integer NOT NULL,
    owner_id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    category_id integer NOT NULL,
    state public."Estado" DEFAULT 'NUEVO'::public."Estado" NOT NULL,
    price integer NOT NULL,
    stock integer NOT NULL,
    features_text text NOT NULL,
    features_rows text[] DEFAULT ARRAY[]::text[],
    features_special text[] DEFAULT ARRAY[]::text[],
    published timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    available boolean DEFAULT true NOT NULL,
    images text[] DEFAULT ARRAY[]::text[],
    colors text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public."Producto" OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 26473)
-- Name: Producto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Producto_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Producto_id_seq" OWNER TO postgres;

--
-- TOC entry 3353 (class 0 OID 0)
-- Dependencies: 210
-- Name: Producto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Producto_id_seq" OWNED BY public."Producto".id;


--
-- TOC entry 212 (class 1259 OID 26485)
-- Name: Proveedor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Proveedor" (
    id integer NOT NULL
);


ALTER TABLE public."Proveedor" OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 26446)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 3190 (class 2604 OID 26494)
-- Name: Categoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categoria" ALTER COLUMN id SET DEFAULT nextval('public."Categoria_id_seq"'::regclass);


--
-- TOC entry 3182 (class 2604 OID 26477)
-- Name: Producto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Producto" ALTER COLUMN id SET DEFAULT nextval('public."Producto_id_seq"'::regclass);


--
-- TOC entry 3346 (class 0 OID 26491)
-- Dependencies: 214
-- Data for Name: Categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--




--
-- TOC entry 3343 (class 0 OID 26474)
-- Dependencies: 211
-- Data for Name: Producto; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- TOC entry 3344 (class 0 OID 26485)
-- Dependencies: 212
-- Data for Name: Proveedor; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3341 (class 0 OID 26446)
-- Dependencies: 209
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3354 (class 0 OID 0)
-- Dependencies: 213
-- Name: Categoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--




--
-- TOC entry 3355 (class 0 OID 0)
-- Dependencies: 210
-- Name: Producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--




--
-- TOC entry 3199 (class 2606 OID 26498)
-- Name: Categoria Categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categoria"
    ADD CONSTRAINT "Categoria_pkey" PRIMARY KEY (id);


--
-- TOC entry 3194 (class 2606 OID 26484)
-- Name: Producto Producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Producto"
    ADD CONSTRAINT "Producto_pkey" PRIMARY KEY (id);


--
-- TOC entry 3196 (class 2606 OID 26489)
-- Name: Proveedor Proveedor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedor"
    ADD CONSTRAINT "Proveedor_pkey" PRIMARY KEY (id);


--
-- TOC entry 3192 (class 2606 OID 26454)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3197 (class 1259 OID 26499)
-- Name: Categoria_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Categoria_name_key" ON public."Categoria" USING btree (name);


--
-- TOC entry 3201 (class 2606 OID 26505)
-- Name: Producto Producto_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Producto"
    ADD CONSTRAINT "Producto_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public."Categoria"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3200 (class 2606 OID 26500)
-- Name: Producto Producto_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Producto"
    ADD CONSTRAINT "Producto_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public."Proveedor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2024-05-10 11:38:03

--
-- PostgreSQL database dump complete
--

