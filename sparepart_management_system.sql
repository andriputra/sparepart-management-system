-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 20 Nov 2025 pada 10.41
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sparepart_management_system`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `spis`
--

CREATE TABLE `spis` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `doc_no` varchar(100) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `code` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `telephone` varchar(100) DEFAULT NULL,
  `part_number` varchar(100) DEFAULT NULL,
  `supplier` varchar(100) DEFAULT NULL,
  `part_description` text DEFAULT NULL,
  `detail_part` text DEFAULT NULL,
  `photo1` varchar(255) DEFAULT NULL,
  `photo2` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `part_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`part_images`)),
  `part_material` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`part_material`)),
  `inspection` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`inspection`)),
  `created_by` varchar(100) DEFAULT NULL,
  `approved_by` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('draft','submitted','completed') DEFAULT 'draft',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `data_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data_json`)),
  `progress_status` enum('step1','step2','step3','completed') DEFAULT 'step1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `spis_draft`
--

CREATE TABLE `spis_draft` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `data_json` longtext DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `spps`
--

CREATE TABLE `spps` (
  `id` int(11) NOT NULL,
  `spis_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `doc_no` varchar(100) DEFAULT NULL,
  `part_number` varchar(100) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `part_description` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `part_weight` varchar(100) DEFAULT NULL,
  `part_dimension` varchar(100) DEFAULT NULL,
  `package_material` varchar(255) DEFAULT NULL,
  `package_code` varchar(100) DEFAULT NULL,
  `package_detail` text DEFAULT NULL,
  `illustration_part` varchar(255) DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `approved_by` varchar(100) DEFAULT NULL,
  `status` enum('draft','submitted','completed') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `detail_part` text DEFAULT NULL,
  `package_0` varchar(255) DEFAULT NULL,
  `package_1` varchar(255) DEFAULT NULL,
  `package_2` varchar(255) DEFAULT NULL,
  `package_3` varchar(255) DEFAULT NULL,
  `package_illustration_0` varchar(255) DEFAULT NULL,
  `package_illustration_1` varchar(255) DEFAULT NULL,
  `result_illustration` varchar(255) DEFAULT NULL,
  `data_json` longtext DEFAULT NULL,
  `package_material_0` varchar(255) DEFAULT NULL,
  `package_code_0` varchar(100) DEFAULT NULL,
  `package_material_1` varchar(255) DEFAULT NULL,
  `package_code_1` varchar(100) DEFAULT NULL,
  `package_material_2` varchar(255) DEFAULT NULL,
  `package_code_2` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `spps_draft`
--

CREATE TABLE `spps_draft` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `data_json` longtext DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `spqs`
--

CREATE TABLE `spqs` (
  `id` int(11) NOT NULL,
  `spis_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `doc_no` varchar(100) DEFAULT NULL,
  `part_number` varchar(100) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `part_description` varchar(255) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `criteria_dimension` varchar(255) DEFAULT NULL,
  `criteria_weight` varchar(255) DEFAULT NULL,
  `criteria_material` varchar(255) DEFAULT NULL,
  `criteria_finishing` varchar(255) DEFAULT NULL,
  `criteria_function` varchar(255) DEFAULT NULL,
  `criteria_completeness` varchar(255) DEFAULT NULL,
  `surface_wear` tinyint(1) DEFAULT 0,
  `surface_damage` tinyint(1) DEFAULT 0,
  `surface_scratch` tinyint(1) DEFAULT 0,
  `surface_crack` tinyint(1) DEFAULT 0,
  `surface_corrosion` tinyint(1) DEFAULT 0,
  `surface_bend` tinyint(1) DEFAULT 0,
  `result` enum('Pass','Rejected','Need Improvement') DEFAULT 'Pass',
  `comment` text DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `approved_by` varchar(100) DEFAULT NULL,
  `checked_by` varchar(100) DEFAULT NULL,
  `status` enum('draft','submitted','completed') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `data_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data_json`)),
  `criteria_dimension_ok` tinyint(1) DEFAULT 0,
  `criteria_dimension_remark` varchar(255) DEFAULT NULL,
  `criteria_weight_ok` tinyint(1) DEFAULT 0,
  `criteria_weight_remark` varchar(255) DEFAULT NULL,
  `criteria_material_ok` tinyint(1) DEFAULT 0,
  `criteria_material_remark` varchar(255) DEFAULT NULL,
  `criteria_finishing_ok` tinyint(1) DEFAULT 0,
  `criteria_finishing_remark` varchar(255) DEFAULT NULL,
  `criteria_function_ok` tinyint(1) DEFAULT 0,
  `criteria_function_remark` varchar(255) DEFAULT NULL,
  `criteria_completeness_ok` tinyint(1) DEFAULT 0,
  `criteria_completeness_remark` varchar(255) DEFAULT NULL,
  `surface_wear_remark` varchar(255) DEFAULT NULL,
  `surface_damage_remark` varchar(255) DEFAULT NULL,
  `surface_scratch_remark` varchar(255) DEFAULT NULL,
  `surface_crack_remark` varchar(255) DEFAULT NULL,
  `surface_corrosion_remark` varchar(255) DEFAULT NULL,
  `surface_bend_remark` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `spqs_draft`
--

CREATE TABLE `spqs_draft` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `data_json` longtext DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','approval','viewer') NOT NULL DEFAULT 'viewer',
  `signature_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `fullname`, `department`, `telephone`, `email`, `password`, `role`, `signature_url`, `created_at`) VALUES
(11, 'admin', 'Martin Paes', 'Inventory Management', '0876627716721', 'admin@example.com', '$2b$10$3ecgulsqqqSAcJzHTdA5/uMMEgJKqcpVmaeZwDqZL59aAdGblYCZC', 'admin', '/uploads/signatures/1762919095484.png', '2025-10-25 02:31:30'),
(12, 'approver user', 'Approver User', 'Approved', '021812992121', 'approver@example.com', '$2b$10$LG3HzWx1jietCucWXNJgZ.SLNGv64zrHypZB2FHtDvkchQKerdEJy', 'approval', '/uploads/signatures/1762402972274.png', '2025-10-25 02:32:28'),
(14, 'view melihat', 'Melihat', NULL, NULL, 'tamu@example.com', '$2b$10$gYTgPRNrzPYFg.Zt5xMTj.SArWjQapgMqdO1a5nuJMy3fvGL76UU6', 'viewer', NULL, '2025-10-29 12:55:50');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `spis`
--
ALTER TABLE `spis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_spis_user` (`user_id`);

--
-- Indeks untuk tabel `spis_draft`
--
ALTER TABLE `spis_draft`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_unique_draft` (`user_id`);

--
-- Indeks untuk tabel `spps`
--
ALTER TABLE `spps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_spps_user` (`user_id`),
  ADD KEY `fk_spps_spis` (`spis_id`);

--
-- Indeks untuk tabel `spps_draft`
--
ALTER TABLE `spps_draft`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_unique_draft` (`user_id`);

--
-- Indeks untuk tabel `spqs`
--
ALTER TABLE `spqs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_spqs_user` (`user_id`),
  ADD KEY `fk_spqs_spis` (`spis_id`);

--
-- Indeks untuk tabel `spqs_draft`
--
ALTER TABLE `spqs_draft`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_unique_draft` (`user_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `spis`
--
ALTER TABLE `spis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT untuk tabel `spis_draft`
--
ALTER TABLE `spis_draft`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=706;

--
-- AUTO_INCREMENT untuk tabel `spps`
--
ALTER TABLE `spps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT untuk tabel `spps_draft`
--
ALTER TABLE `spps_draft`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `spqs`
--
ALTER TABLE `spqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT untuk tabel `spqs_draft`
--
ALTER TABLE `spqs_draft`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `spis`
--
ALTER TABLE `spis`
  ADD CONSTRAINT `fk_spis_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `spps`
--
ALTER TABLE `spps`
  ADD CONSTRAINT `fk_spps_spis` FOREIGN KEY (`spis_id`) REFERENCES `spis` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_spps_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `spqs`
--
ALTER TABLE `spqs`
  ADD CONSTRAINT `fk_spqs_spis` FOREIGN KEY (`spis_id`) REFERENCES `spis` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_spqs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
