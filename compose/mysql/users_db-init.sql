-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 10-05-2024 a las 13:59:44
-- Versión del servidor: 8.0.30
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tp_final`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `banco`
--

CREATE TABLE `banco` (
  `id` bigint NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `banco`
--

INSERT INTO `banco` (`id`, `name`) VALUES
(6, 'Bank of America'),
(2, 'BBVA'),
(5, 'Credicoop'),
(3, 'Nacion'),
(4, 'Patagonia'),
(1, 'Santander');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `id` bigint NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `empresa`
--

INSERT INTO `empresa` (`id`, `name`) VALUES
(1, 'Apple'),
(2, 'Microsoft'),
(3, 'Saudi Aramco'),
(4, 'Alphabet'),
(5, 'Amazon'),
(6, 'Meta Platforms'),
(7, 'Berkshire Hathaway'),
(8, 'Tesla'),
(9, 'General Motors'),
(10, 'Starware'),
(11, 'Omaha Construcciones'),
(12, 'L-Oreal Paris');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa_seq`
--

CREATE TABLE `empresa_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `empresa_seq`
--

INSERT INTO `empresa_seq` (`next_val`) VALUES
(1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pais`
--

CREATE TABLE `pais` (
  `id` bigint NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `pais`
--

INSERT INTO `pais` (`id`, `code`, `name`) VALUES
(253, 'AF', 'Afganistán'),
(254, 'AX', 'Islas Åland'),
(255, 'AL', 'Albania'),
(256, 'DZ', 'Argelia'),
(257, 'AS', 'Samoa Americana'),
(258, 'AD', 'Andorra'),
(259, 'AO', 'Angola'),
(260, 'AI', 'Anguila'),
(261, 'AQ', 'Antártida'),
(262, 'AG', 'Antigua y Barbuda'),
(263, 'AR', 'Argentina'),
(264, 'AM', 'Armenia'),
(265, 'AW', 'Aruba'),
(266, 'AU', 'Australia'),
(267, 'AT', 'Austria'),
(268, 'AZ', 'Azerbaiyán'),
(269, 'BS', 'Bahamas'),
(270, 'BH', 'Baréin'),
(271, 'BD', 'Bangladés'),
(272, 'BB', 'Barbados'),
(273, 'BY', 'Bielorrusia'),
(274, 'BE', 'Bélgica'),
(275, 'BZ', 'Belice'),
(276, 'BJ', 'Benín'),
(277, 'BM', 'Bermudas'),
(278, 'BT', 'Bután'),
(279, 'BO', 'Bolivia'),
(280, 'BQ', 'Bonaire, San Eustaquio y Saba'),
(281, 'BA', 'Bosnia y Herzegovina'),
(282, 'BW', 'Botsuana'),
(283, 'BV', 'Isla Bouvet'),
(284, 'BR', 'Brasil'),
(285, 'IO', 'Territorio Británico del Océano Índico'),
(286, 'BN', 'Brunéi'),
(287, 'BG', 'Bulgaria'),
(288, 'BF', 'Burkina Faso'),
(289, 'BI', 'Burundi'),
(290, 'CV', 'Cabo Verde'),
(291, 'KH', 'Camboya'),
(292, 'CM', 'Camerún'),
(293, 'CA', 'Canadá'),
(294, 'KY', 'Islas Caimán'),
(295, 'CF', 'República Centroafricana'),
(296, 'TD', 'Chad'),
(297, 'CL', 'Chile'),
(298, 'CN', 'China'),
(299, 'CX', 'Isla de Navidad'),
(300, 'CC', 'Islas Cocos'),
(301, 'CO', 'Colombia'),
(302, 'KM', 'Comoras'),
(303, 'CG', 'Congo'),
(304, 'CD', 'Congo (República Democrática del)'),
(305, 'CK', 'Islas Cook'),
(306, 'CR', 'Costa Rica'),
(307, 'CI', 'Costa de Marfil'),
(308, 'HR', 'Croacia'),
(309, 'CU', 'Cuba'),
(310, 'CW', 'Curazao'),
(311, 'CY', 'Chipre'),
(312, 'CZ', 'República Checa'),
(313, 'DK', 'Dinamarca'),
(314, 'DJ', 'Yibuti'),
(315, 'DM', 'Dominica'),
(316, 'DO', 'República Dominicana'),
(317, 'EC', 'Ecuador'),
(318, 'EG', 'Egipto'),
(319, 'SV', 'El Salvador'),
(320, 'GQ', 'Guinea Ecuatorial'),
(321, 'ER', 'Eritrea'),
(322, 'EE', 'Estonia'),
(323, 'ET', 'Etiopía'),
(324, 'FK', 'Islas Malvinas'),
(325, 'FO', 'Islas Feroe'),
(326, 'FJ', 'Fiyi'),
(327, 'FI', 'Finlandia'),
(328, 'FR', 'Francia'),
(329, 'GF', 'Guayana Francesa'),
(330, 'PF', 'Polinesia Francesa'),
(331, 'TF', 'Territorios Franceses del Sur'),
(332, 'GA', 'Gabón'),
(333, 'GM', 'Gambia'),
(334, 'GE', 'Georgia'),
(335, 'DE', 'Alemania'),
(336, 'GH', 'Ghana'),
(337, 'GI', 'Gibraltar'),
(338, 'GR', 'Grecia'),
(339, 'GL', 'Groenlandia'),
(340, 'GD', 'Granada'),
(341, 'GP', 'Guadalupe'),
(342, 'GU', 'Guam'),
(343, 'GT', 'Guatemala'),
(344, 'GG', 'Guernsey'),
(345, 'GN', 'Guinea'),
(346, 'GW', 'Guinea-Bisáu'),
(347, 'GY', 'Guyana'),
(348, 'HT', 'Haití'),
(349, 'HM', 'Islas Heard y McDonald'),
(350, 'VA', 'Ciudad del Vaticano'),
(351, 'HN', 'Honduras'),
(352, 'HK', 'Hong Kong'),
(353, 'HU', 'Hungría'),
(354, 'IS', 'Islandia'),
(355, 'IN', 'India'),
(356, 'ID', 'Indonesia'),
(357, 'IR', 'Irán'),
(358, 'IQ', 'Iraq'),
(359, 'IE', 'Irlanda'),
(360, 'IM', 'Isla de Man'),
(361, 'IL', 'Israel'),
(362, 'IT', 'Italia'),
(363, 'JM', 'Jamaica'),
(364, 'JP', 'Japón'),
(365, 'JE', 'Jersey'),
(366, 'JO', 'Jordania'),
(367, 'KZ', 'Kazajistán'),
(368, 'KE', 'Kenia'),
(369, 'KI', 'Kiribati'),
(370, 'KW', 'Kuwait'),
(371, 'KG', 'Kirguistán'),
(372, 'LA', 'Laos'),
(373, 'LV', 'Letonia'),
(374, 'LB', 'Líbano'),
(375, 'LS', 'Lesoto'),
(376, 'LR', 'Liberia'),
(377, 'LY', 'Libia'),
(378, 'LI', 'Liechtenstein'),
(379, 'LT', 'Lituania'),
(380, 'LU', 'Luxemburgo'),
(381, 'MO', 'Macao'),
(382, 'MG', 'Madagascar'),
(383, 'MW', 'Malaui'),
(384, 'MY', 'Malasia'),
(385, 'MV', 'Maldivas'),
(386, 'ML', 'Malí'),
(387, 'MT', 'Malta'),
(388, 'MH', 'Islas Marshall'),
(389, 'MQ', 'Martinica'),
(390, 'MR', 'Mauritania'),
(391, 'MU', 'Mauricio'),
(392, 'YT', 'Mayotte'),
(393, 'MX', 'México'),
(394, 'FM', 'Micronesia'),
(395, 'MD', 'Moldavia'),
(396, 'MC', 'Mónaco'),
(397, 'MN', 'Mongolia'),
(398, 'ME', 'Montenegro'),
(399, 'MS', 'Montserrat'),
(400, 'MA', 'Marruecos'),
(401, 'MZ', 'Mozambique'),
(402, 'MM', 'Birmania'),
(403, 'NA', 'Namibia'),
(404, 'NR', 'Nauru'),
(405, 'NP', 'Nepal'),
(406, 'NL', 'Países Bajos'),
(407, 'NC', 'Nueva Caledonia'),
(408, 'NZ', 'Nueva Zelanda'),
(409, 'NI', 'Nicaragua'),
(410, 'NE', 'Níger'),
(411, 'NG', 'Nigeria'),
(412, 'NU', 'Niue'),
(413, 'NF', 'Isla Norfolk'),
(414, 'KP', 'Corea del Norte'),
(415, 'MP', 'Islas Marianas del Norte'),
(416, 'NO', 'Noruega'),
(417, 'OM', 'Omán'),
(418, 'PK', 'Pakistán'),
(419, 'PW', 'Palaos'),
(420, 'PS', 'Palestina'),
(421, 'PA', 'Panamá'),
(422, 'PG', 'Papúa Nueva Guinea'),
(423, 'PY', 'Paraguay'),
(424, 'PE', 'Perú'),
(425, 'PH', 'Filipinas'),
(426, 'PN', 'Islas Pitcairn'),
(427, 'PL', 'Polonia'),
(428, 'PT', 'Portugal'),
(429, 'PR', 'Puerto Rico'),
(430, 'QA', 'Catar'),
(431, 'RE', 'Reunión'),
(432, 'RO', 'Rumanía'),
(433, 'RU', 'Rusia'),
(434, 'RW', 'Ruanda'),
(435, 'BL', 'San Bartolomé'),
(436, 'SH', 'Santa Elena, Ascensión y Tristán de Acuña'),
(437, 'KN', 'San Cristóbal y Nieves'),
(438, 'LC', 'Santa Lucía'),
(439, 'MF', 'San Martín'),
(440, 'PM', 'San Pedro y Miquelón'),
(441, 'VC', 'San Vicente y las Granadinas'),
(442, 'WS', 'Samoa'),
(443, 'SM', 'San Marino'),
(444, 'ST', 'Santo Tomé y Príncipe'),
(445, 'SA', 'Arabia Saudí'),
(446, 'SN', 'Senegal'),
(447, 'RS', 'Serbia'),
(448, 'SC', 'Seychelles'),
(449, 'SL', 'Sierra Leona'),
(450, 'SG', 'Singapur'),
(451, 'SX', 'Sint Maarten'),
(452, 'SK', 'Eslovaquia'),
(453, 'SI', 'Eslovenia'),
(454, 'SB', 'Islas Salomón'),
(455, 'SO', 'Somalia'),
(456, 'ZA', 'Sudáfrica'),
(457, 'GS', 'Islas Georgia del Sur y Sandwich del Sur'),
(458, 'KR', 'Corea del Sur'),
(459, 'SS', 'Sudán del Sur'),
(460, 'ES', 'España'),
(461, 'LK', 'Sri Lanka'),
(462, 'SD', 'Sudán'),
(463, 'SR', 'Surinam'),
(464, 'SJ', 'Svalbard y Jan Mayen'),
(465, 'SZ', 'Suazilandia'),
(466, 'SE', 'Suecia'),
(467, 'CH', 'Suiza'),
(468, 'SY', 'Siria'),
(469, 'TW', 'Taiwán'),
(470, 'TJ', 'Tayikistán'),
(471, 'TZ', 'Tanzania'),
(472, 'TH', 'Tailandia'),
(473, 'TL', 'Timor Oriental'),
(474, 'TG', 'Togo'),
(475, 'TK', 'Tokelau'),
(476, 'TO', 'Tonga'),
(477, 'TT', 'Trinidad y Tobago'),
(478, 'TN', 'Túnez'),
(479, 'TR', 'Turquía'),
(480, 'TM', 'Turkmenistán'),
(481, 'TC', 'Islas Turcas y Caicos'),
(482, 'TV', 'Tuvalu'),
(483, 'UG', 'Uganda'),
(484, 'UA', 'Ucrania'),
(485, 'AE', 'Emiratos Árabes Unidos'),
(486, 'GB', 'Reino Unido'),
(487, 'US', 'Estados Unidos'),
(488, 'UY', 'Uruguay'),
(489, 'UZ', 'Uzbekistán'),
(490, 'VU', 'Vanuatu'),
(491, 'VE', 'Venezuela'),
(492, 'VN', 'Vietnam'),
(493, 'WF', 'Wallis y Futuna'),
(494, 'EH', 'Sáhara Occidental'),
(495, 'YE', 'Yemen'),
(496, 'ZM', 'Zambia'),
(497, 'ZW', 'Zimbabue');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `money` float DEFAULT NULL,
  `bank_id` bigint DEFAULT NULL,
  `country_id` bigint NOT NULL,
  `id` bigint NOT NULL,
  `org_id` bigint DEFAULT NULL,
  `user_type` varchar(31) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `register_date` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_seq`
--

CREATE TABLE `usuario_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuario_seq`
--

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `banco`
--
ALTER TABLE `banco`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_7e3ckmfcn6fn89b9e2mm13bsv` (`name`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pais`
--
ALTER TABLE `pais`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_sbfrs3v5muy7u9xsky8lt7y77` (`code`),
  ADD UNIQUE KEY `UK_6vvvp2b5kcx0yvkq55cb9maue` (`name`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKk6ms32iq4ay2u4w5dtx29h3o8` (`name`,`password`),
  ADD UNIQUE KEY `UK_pmgbijk22x1qv650yjmvj4j1b` (`name`),
  ADD KEY `FK66xkoflqj06g8p0iqt8kfb1o5` (`country_id`),
  ADD KEY `FK5bmdjq74ka4quwywlyf7hgx5q` (`bank_id`),
  ADD KEY `FK9k1rashnv2wvlrc8yqf3ca1yl` (`org_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `banco`
--
ALTER TABLE `banco`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `pais`
--
ALTER TABLE `pais`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=498;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `FK5bmdjq74ka4quwywlyf7hgx5q` FOREIGN KEY (`bank_id`) REFERENCES `banco` (`id`),
  ADD CONSTRAINT `FK66xkoflqj06g8p0iqt8kfb1o5` FOREIGN KEY (`country_id`) REFERENCES `pais` (`id`),
  ADD CONSTRAINT `FK9k1rashnv2wvlrc8yqf3ca1yl` FOREIGN KEY (`org_id`) REFERENCES `empresa` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
