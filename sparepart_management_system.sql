-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 27 Okt 2025 pada 10.42
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
  `status` enum('draft','submitted') DEFAULT 'draft',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `data_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data_json`)),
  `progress_status` enum('step1','step2','step3','completed') DEFAULT 'step1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `spis`
--

INSERT INTO `spis` (`id`, `user_id`, `doc_no`, `date`, `location`, `code`, `name`, `department`, `telephone`, `part_number`, `supplier`, `part_description`, `detail_part`, `photo1`, `photo2`, `description`, `part_images`, `part_material`, `inspection`, `created_by`, `approved_by`, `created_at`, `status`, `updated_at`, `data_json`, `progress_status`) VALUES
(44, 11, 'IM/SPIS/2025/10/00001', '2025-10-20', 'Hiangjou', 'HG12189', 'Sugiaono', 'Inventory Management', '0876627716721', '8209310293091280MHJY123012', 'Honda', 'Part Honda', 'Detail Part oHinda', '/uploads/spis/1761554819654.jpeg', '/uploads/spis/1761554819658.jpeg', 'dasda', '[{\"url\":\"/uploads/spis/1761554819643.png\",\"description\":\"INI asdas\"},{\"url\":\"/uploads/spis/1761554819650.png\",\"description\":\"ini cave\"}]', '[\"Plastic\",\"Metal\"]', '{\"visual_condition\":\"Good Condition\",\"part_system\":\"Party Giid\",\"length\":\"45\",\"width\":\"21\",\"height\":\"21\",\"weight\":\"32\",\"package_dimension\":\"32324\"}', 'Sugiaono', '', '2025-10-27 08:46:59', 'submitted', '2025-10-27 08:48:35', NULL, 'completed');

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
  `status` enum('draft','submitted') DEFAULT 'submitted',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `detail_parts` text DEFAULT NULL,
  `package_0` varchar(255) DEFAULT NULL,
  `package_1` varchar(255) DEFAULT NULL,
  `package_2` varchar(255) DEFAULT NULL,
  `package_3` varchar(255) DEFAULT NULL,
  `package_illustration_0` varchar(255) DEFAULT NULL,
  `package_illustration_1` varchar(255) DEFAULT NULL,
  `result_illustration` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `spps`
--

INSERT INTO `spps` (`id`, `spis_id`, `user_id`, `doc_no`, `part_number`, `supplier`, `part_description`, `date`, `qty`, `part_weight`, `part_dimension`, `package_material`, `package_code`, `package_detail`, `illustration_part`, `created_by`, `approved_by`, `status`, `created_at`, `updated_at`, `detail_parts`, `package_0`, `package_1`, `package_2`, `package_3`, `package_illustration_0`, `package_illustration_1`, `result_illustration`) VALUES
(24, 44, 11, 'IM/SPPS/2025/10/00001', '8209310293091280MHJY123012', 'Honda', 'Part Honda', '2025-10-20', 231, '32', '32324', '1312', '323', '232sdasd', NULL, 'Sugiaono', '', 'submitted', '2025-10-27 08:48:06', '2025-10-27 08:48:06', NULL, '/uploads/c1e5121f6c1f3106f572e02e5012beee', '/uploads/b00d74bd8a694640c6cc6ce94f0c7c9a', '/uploads/1ef5f0992fb94604d42656d995756b39', '/uploads/6844f0bc2897427a20c74af8b4fcfb71', '/uploads/a5192b55a479981a6016b39c858efb43', '/uploads/0bf10a1f6dbc5d848c2330a0ea6d3b53', '/uploads/432305c165bf5f510f09977aeac19945');

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
  `status` enum('draft','submitted') DEFAULT 'submitted',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `data_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `spqs`
--

INSERT INTO `spqs` (`id`, `spis_id`, `user_id`, `doc_no`, `part_number`, `date`, `part_description`, `supplier`, `criteria_dimension`, `criteria_weight`, `criteria_material`, `criteria_finishing`, `criteria_function`, `criteria_completeness`, `surface_wear`, `surface_damage`, `surface_scratch`, `surface_crack`, `surface_corrosion`, `surface_bend`, `result`, `comment`, `created_by`, `approved_by`, `checked_by`, `status`, `created_at`, `updated_at`, `data_json`) VALUES
(3, 44, 11, 'IM/SPQS/2025/10/00001', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 'Pass', NULL, NULL, NULL, NULL, 'submitted', '2025-10-27 08:48:35', '2025-10-27 08:48:35', '{\"part_number\":\"8209310293091280MHJY123012\",\"date\":\"2025-10-20\",\"part_description\":\"Part Honda\",\"supplier\":\"Honda\",\"image1\":\"\",\"image2\":\"\",\"criteria\":{\"dimension\":\"\",\"weight\":\"\",\"material\":\"\",\"finishing\":\"\",\"function\":\"\",\"completeness\":\"\",\"surface\":{\"wear\":true,\"damage\":false,\"scratch\":false,\"crack\":false,\"corrosion\":true,\"bend\":false},\"package_dimension_ok\":true,\"finishing_ok\":true,\"package_dimension_remark\":\"sasddsa\",\"weight_remark\":\"dasdas\",\"material_remark\":\"12edascasa\",\"finishing_remark\":\"sdasdasa\",\"function_remark\":\"dasdasd\",\"completeness_remark\":\"sdasd\"},\"result\":\"Need Improvement\",\"comment\":\"Butuh pembaruan\",\"created_by\":\"Sugiaono\",\"approved_by\":\"\",\"checked_by\":\"\",\"location\":\"Hiangjou\",\"code\":\"HG12189\",\"name\":\"Sugiaono\",\"department\":\"Inventory Management\",\"telephone\":\"0876627716721\",\"description\":\"dasda\",\"photo\":null,\"part_material\":[\"Plastic\",\"Metal\"],\"inspection\":{\"visual_condition\":\"Good Condition\",\"part_system\":\"Party Giid\",\"length\":\"45\",\"width\":\"21\",\"height\":\"21\",\"weight\":\"32\",\"package_dimension\":\"32324\"},\"detail_part\":\"Detail Part oHinda\",\"photo1\":{},\"photo1_url\":\"blob:http://localhost:5173/ada522a0-fe07-4801-983f-ab6744d645c6\",\"photo2\":{},\"photo2_url\":\"blob:http://localhost:5173/b760ec63-a440-417e-83aa-da41ce4fd5a2\",\"part_images\":[{\"file\":{},\"description\":\"INI asdas\"},{\"file\":{},\"description\":\"ini cave\"}],\"qty\":\"231\",\"part_weight\":\"32\",\"part_dimension\":\"32324\",\"detail_parts\":\"Detail Part oHinda\",\"package_material\":\"1312\",\"package_code\":\"323\",\"package_detail\":\"232sdasd\",\"illustration_part\":\"blob:http://localhost:5173/ada522a0-fe07-4801-983f-ab6744d645c6\",\"package_0\":{},\"package_0_url\":\"blob:http://localhost:5173/67a44000-dc00-4ea9-95e4-cccb0d1180fc\",\"package_1\":{},\"package_1_url\":\"blob:http://localhost:5173/0c55b9f1-6ed7-4821-9ac9-a1eddef25bd8\",\"package_2\":{},\"package_2_url\":\"blob:http://localhost:5173/f486ba58-17cc-40e3-9373-16cf8d3bfea4\",\"package_3\":{},\"package_3_url\":\"blob:http://localhost:5173/a00b5d38-4de8-40fc-a664-5a6d7c78309d\",\"package_illustration_0\":{},\"package_illustration_0_url\":\"blob:http://localhost:5173/498cfb8f-dc76-4890-b1be-b9f4443ff279\",\"package_illustration_1\":{},\"package_illustration_1_url\":\"blob:http://localhost:5173/4f22450a-dc7b-4b65-8cc5-9948afe9b026\",\"result_illustration\":{},\"result_illustration_url\":\"blob:http://localhost:5173/04295fc4-51ed-40f1-a2e0-2cb74d5c94ff\",\"spps_id\":24}');

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
(11, 'admin', 'Sugiaono', 'Inventory Management', '0876627716721', 'admin@example.com', '$2b$10$3ecgulsqqqSAcJzHTdA5/uMMEgJKqcpVmaeZwDqZL59aAdGblYCZC', 'admin', '/uploads/signatures/1761373859010.png', '2025-10-25 02:31:30'),
(12, 'approver user', 'Approver User', NULL, NULL, 'approver@example.com', '$2b$10$LG3HzWx1jietCucWXNJgZ.SLNGv64zrHypZB2FHtDvkchQKerdEJy', 'approval', NULL, '2025-10-25 02:32:28'),
(13, 'viewer', 'Viewer User', NULL, NULL, 'viewer@example.com', '$2b$10$gv5MYi3ibKQyXySBgDHClui6rhiWPtoa6dnJoBITmAZjyq.uGUziS', 'viewer', NULL, '2025-10-25 02:33:04');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT untuk tabel `spis_draft`
--
ALTER TABLE `spis_draft`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=698;

--
-- AUTO_INCREMENT untuk tabel `spps`
--
ALTER TABLE `spps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT untuk tabel `spps_draft`
--
ALTER TABLE `spps_draft`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `spqs`
--
ALTER TABLE `spqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `spqs_draft`
--
ALTER TABLE `spqs_draft`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
