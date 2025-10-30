-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 30 Okt 2025 pada 07.21
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

--
-- Dumping data untuk tabel `spis`
--

INSERT INTO `spis` (`id`, `user_id`, `doc_no`, `date`, `location`, `code`, `name`, `department`, `telephone`, `part_number`, `supplier`, `part_description`, `detail_part`, `photo1`, `photo2`, `description`, `part_images`, `part_material`, `inspection`, `created_by`, `approved_by`, `created_at`, `status`, `updated_at`, `data_json`, `progress_status`) VALUES
(46, 11, 'IM/SPIS/2025/10/00007', '2025-10-21', 'sada', 'dasd', 'Sugiaono', 'Inventory Management', '0876627716721', '2312', 'sdas', 'sdas', 'dsa', 'blob:http://localhost:5173/5c0b1eee-6294-48ac-8b99-ef12b067d8c2', 'blob:http://localhost:5173/94b84fd5-38ca-4df1-937f-5eddff4e792e', 'sda', '[{\"url\":\"blob:http://localhost:5173/a3357fa2-f71b-41ea-a0eb-93531378720a\",\"description\":\"das\"}]', '[\"Glass\"]', '{\"visual_condition\":\"sda\",\"part_system\":\"das\",\"length\":\"das21312\",\"width\":\"231\",\"height\":\"312\",\"weight\":\"312\",\"package_dimension\":\"das21312 x 231 x 312\"}', 'Sugiaono', '', '2025-10-28 06:15:29', 'submitted', '2025-10-28 06:30:00', NULL, 'completed'),
(47, 11, 'IM/SPIS/2025/10/00008', '2025-10-21', 'sada', 'dasd', 'Sugiaono', 'Inventory Management', '0876627716721', '2312', 'sdas', 'sdas', 'dsa', 'blob:http://localhost:5173/5c0b1eee-6294-48ac-8b99-ef12b067d8c2', 'blob:http://localhost:5173/94b84fd5-38ca-4df1-937f-5eddff4e792e', 'sda', '[]', '[\"Glass\"]', '{\"visual_condition\":\"sda\",\"part_system\":\"das\",\"length\":\"das21312\",\"width\":\"231\",\"height\":\"312\",\"weight\":\"312\",\"package_dimension\":\"das21312 x 231 x 312\"}', 'Sugiaono', '', '2025-10-28 06:33:32', 'submitted', '2025-10-28 06:33:50', NULL, 'completed'),
(48, 11, 'IM/SPIS/2025/10/00009', '2025-10-21', 'sdasda', '213123', 'Sugiaono', 'Inventory Management', '0876627716721', 'sdasd', '21312', 'dasd', 'das', 'blob:http://localhost:5173/579abbfc-7558-44f5-904a-7ffe27d8f6ce', 'blob:http://localhost:5173/2e12bbf8-e30a-4ee0-8a8d-e98c87e0c87e', 'sdas', '[{\"url\":\"blob:http://localhost:5173/3d46b575-bffd-40e8-a13a-1fdaebfef826\",\"description\":\"dasd\"}]', '[\"Glass\"]', '{\"visual_condition\":\"sdas\",\"part_system\":\"asd\",\"length\":\"213\",\"width\":\"2131\",\"height\":\"312\",\"weight\":\"3123\",\"package_dimension\":\"213 x 2131 x 312\"}', 'Sugiaono', 'Hureian', '2025-10-28 06:45:17', 'completed', '2025-10-29 12:51:57', NULL, 'completed'),
(49, 11, 'IM/SPIS/2025/10/00010', '2025-10-27', '21adloasc', 's21212', 'Sugiaono', 'Inventory Management', '0876627716721', 'scasd', 'dasd', 'dasd', 'das', '/uploads/spis/1761634443059.png', '/uploads/spis/1761634443060.png', 'sdas', '[{\"url\":\"/uploads/spis/1761634443051.png\",\"description\":\"dasd\"}]', '[\"Glass\"]', '{\"visual_condition\":\"dsd\",\"part_system\":\"das\",\"length\":\"231\",\"width\":\"312\",\"height\":\"312\",\"weight\":\"312\",\"package_dimension\":\"231 x 312 x 312\"}', 'Sugiaono', 'Approver User', '2025-10-28 06:54:03', 'completed', '2025-10-29 12:18:04', NULL, 'completed'),
(51, 11, 'IM/SPIS/2025/10/00012', '2025-10-21', 'Draft', 'dasda', 'Sugiaono', 'Inventory Management', '0876627716721', '212213', 'sdas', 'das', 'dasd', '/uploads/spis/1761635491030.png', '/uploads/spis/1761635491034.webp', 'zsdas', '[]', '[\"Glass\"]', '{\"visual_condition\":\"sdas\",\"part_system\":\"212\",\"length\":\"21\",\"width\":\"12\",\"height\":\"21\",\"weight\":\"21\",\"package_dimension\":\"21 x 12 x 21\"}', 'Sugiaono', '', '2025-10-28 07:11:31', 'submitted', '2025-10-28 07:11:31', NULL, 'step1'),
(53, 11, 'IM/SPIS/2025/10/00014', '2025-10-21', 'Jakarta', 'JKT901290021', 'Sugiaono', 'Inventory Management', '0876627716721', '8199219901209092YUDH', 'SUP-JKY', 'Part Deskripsi', 'part detail only', '/uploads/spis/1761726001838.png', '/uploads/spis/1761726001839.png', 'Ini dalam ketrangan apapun itu selalu ada ketrangan di setiap field yang akan di sisi seshingga ramai text yang di isinya', '[{\"url\":\"/uploads/spis/1761726001829.jpeg\",\"description\":\"Astro\"},{\"url\":\"/uploads/spis/1761726001830.png\",\"description\":\"bumbu\"},{\"url\":\"/uploads/spis/1761726001833.png\",\"description\":\"bumbu juga\"},{\"url\":\"/uploads/spis/1761726001838.jpg\",\"description\":\"Beef\"},{\"url\":\"/uploads/spis/1761726001838.png\",\"description\":\"Security\"},{\"url\":\"/uploads/spis/1761726001838.jpg\",\"description\":\"Paha Ayam\"},{\"url\":\"/uploads/spis/1761726001838.jpeg\",\"description\":\"nasi Uduk\"},{\"url\":\"/uploads/spis/1761726001838.jpeg\",\"description\":\"Cyber image\"}]', '[\"Metal\",\"Plastic\",\"Glass\",\"Rubber\",\"Other: other juga\"]', '{\"visual_condition\":\"Good Condition\",\"part_system\":\"Plug and play\",\"length\":\"12\",\"width\":\"33\",\"height\":\"22\",\"weight\":\"213\",\"package_dimension\":\"12 x 33 x 22\"}', 'Sugiaono', '', '2025-10-29 08:20:01', 'submitted', '2025-10-29 08:20:01', NULL, 'step1'),
(54, 11, 'IM/SPIS/2025/10/00015', '2025-10-28', 'Sulawesi', 'SLW-00912990', 'Sugiaono', 'Inventory Management', '0876627716721', '881021929MHK929012', 'Hyundai', 'Part bember depan Atto2', 'part depan mobil atoo22', 'blob:http://localhost:5173/25ecd2c4-8053-4deb-ba17-4c11cb9cd1ca', 'blob:http://localhost:5173/450052b2-e9bd-42b1-b6ce-f3e2eeebd195', 'Ini part keratangan ', '[]', '[\"Plastic\",\"Other: Carbon Kevlar\"]', '{\"visual_condition\":\"Second Hand\",\"part_system\":\"SVC-Hand\",\"length\":\"4322\",\"width\":\"2323\",\"height\":\"3232\",\"weight\":\"244242\",\"package_dimension\":\"4322 x 2323 x 3232\"}', 'Sugiaono', '', '2025-10-29 09:05:37', 'submitted', '2025-10-29 09:07:16', NULL, 'step2'),
(55, 15, 'IM/SPIS/2025/10/00016', '2025-10-29', 'Surabaya', 'SBY-8129192020', 'Hummer Stark', 'Penerangan', '086727881289129', '819291020-129-0192-09', 'PT Maspion Group', 'I’m Tutu Panci', 'tutuop pancai', '/uploads/spis/1761744733863.jpg', '/uploads/spis/1761744733890.png', 'ketrangan yang bisa di pertanggung jawabkan', '[{\"url\":\"/uploads/spis/1761744733855.webp\",\"description\":\"212\"},{\"url\":\"/uploads/spis/1761744733860.webp\",\"description\":\"dasd\"},{\"url\":\"/uploads/spis/1761744733862.webp\",\"description\":\"sas\"}]', '[\"Rubber\",\"Metal\",\"Plastic\",\"Glass\",\"Other: Lain lain\"]', '{\"visual_condition\":\"Good Condition\",\"part_system\":\"PRAT-21910220\",\"length\":\"431\",\"width\":\"21212\",\"height\":\"3131\",\"weight\":\"1212\",\"package_dimension\":\"431 x 21212 x 3131\"}', 'Hummer Stark', 'Hureian', '2025-10-29 13:32:13', 'completed', '2025-10-30 06:18:07', NULL, 'completed'),
(56, 11, 'IM/SPIS/2025/10/00017', '2025-10-29', 'TYUYAS', '23123123', 'Sugiaono', 'Inventory Management', '0876627716721', '212312412312sdasd12312312', 'dasd', 'dasd', 'das', '/uploads/spis/1761803211336.webp', '/uploads/spis/1761803211339.webp', 'dasdas', '[{\"url\":\"/uploads/spis/1761803211335.webp\",\"description\":\"Ini das\"},{\"url\":\"/uploads/spis/1761803211336.webp\",\"description\":\"dasdia\"}]', '[\"Glass\",\"Rubber\"]', '{\"visual_condition\":\"GHooda\",\"part_system\":\"dasda\",\"length\":\"12\",\"width\":\"312\",\"height\":\"312\",\"weight\":\"231\",\"package_dimension\":\"12 x 312 x 312\"}', 'Sugiaono', '', '2025-10-30 05:46:51', 'submitted', '2025-10-30 05:46:51', NULL, 'step1');

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

--
-- Dumping data untuk tabel `spis_draft`
--

INSERT INTO `spis_draft` (`id`, `user_id`, `data_json`, `updated_at`) VALUES
(700, 11, '{\"doc_no\":\"IM/SPIS/2025/10/00012\",\"date\":\"2025-10-21\",\"location\":\"Draft\",\"code\":\"dasda\",\"name\":\"Sugiaono\",\"department\":\"Inventory Management\",\"telephone\":\"0876627716721\",\"part_number\":\"212213\",\"supplier\":\"\",\"part_description\":\"\",\"description\":\"\",\"part_material\":[],\"inspection\":{\"visual_condition\":\"\",\"part_system\":\"\",\"length\":\"\",\"width\":\"\",\"height\":\"\",\"weight\":\"\",\"package_dimension\":\"\"},\"created_by\":\"Sugiaono\",\"approved_by\":\"\",\"id\":699,\"user_id\":11,\"data_json\":\"{\\\"doc_no\\\":\\\"IM/SPIS/2025/10/00008\\\",\\\"date\\\":\\\"2025-10-21\\\",\\\"location\\\":\\\"sada\\\",\\\"code\\\":\\\"dasd\\\",\\\"name\\\":\\\"Sugiaono\\\",\\\"department\\\":\\\"Inventory Management\\\",\\\"telephone\\\":\\\"0876627716721\\\",\\\"part_number\\\":\\\"2312\\\",\\\"supplier\\\":\\\"sdas\\\",\\\"part_description\\\":\\\"sdas\\\",\\\"description\\\":\\\"sda\\\",\\\"part_material\\\":[\\\"Glass\\\"],\\\"inspection\\\":{\\\"visual_condition\\\":\\\"sda\\\",\\\"part_system\\\":\\\"das\\\",\\\"length\\\":\\\"das21312\\\",\\\"width\\\":\\\"231\\\",\\\"height\\\":\\\"312\\\",\\\"weight\\\":\\\"312\\\",\\\"package_dimension\\\":\\\"das21312 x 231 x 312\\\"},\\\"created_by\\\":\\\"Sugiaono\\\",\\\"approved_by\\\":\\\"\\\",\\\"detail_part\\\":\\\"dsa\\\",\\\"photo1\\\":{},\\\"photo1_url\\\":\\\"blob:http://localhost:5173/5c0b1eee-6294-48ac-8b99-ef12b067d8c2\\\",\\\"photo2\\\":{},\\\"photo2_url\\\":\\\"blob:http://localhost:5173/94b84fd5-38ca-4df1-937f-5eddff4e792e\\\",\\\"part_images\\\":[{\\\"url\\\":\\\"blob:http://localhost:5173/a3357fa2-f71b-41ea-a0eb-93531378720a\\\",\\\"description\\\":\\\"das\\\"}],\\\"photo_url\\\":null}\",\"updated_at\":\"2025-10-28T06:30:27.000Z\",\"part_images\":[],\"photo_url\":null}', '2025-10-28 07:10:30');

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
(31, 46, 11, 'IM/SPPS/2025/10/00005', '2312', 'sdas', 'sdas', '2025-10-21', 2, '312', 'das21312 x 231 x 312', 'das', 'das', 'dasd', NULL, 'Sugiaono', '', 'submitted', '2025-10-28 06:16:45', '2025-10-28 06:18:05', NULL, '/uploads/01423b07d8e4928bccfa55d5f2fb4c7f', '/uploads/e6bc6ec34cb7d406176522fce85b3fd7', NULL, NULL, '/uploads/d5ec773eb0d6200792e69a3fb83af0cc', NULL, '/uploads/8dc91a20ea11d4681e07e9587fb24676'),
(32, 47, 11, 'IM/SPPS/2025/10/00006', '2312', 'sdas', 'sdas', '2025-10-21', 12, '312', 'das21312 x 231 x 312', '12', 'das', 'das', NULL, 'Sugiaono', '', 'submitted', '2025-10-28 06:33:43', '2025-10-28 06:33:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, 48, 11, 'IM/SPPS/2025/10/00007', 'sdasd', '21312', 'dasd', '2025-10-21', 21, '3123', '213 x 2131 x 312', 'sdas', 'das', 'dasdas', NULL, 'Sugiaono', 'Hureian', 'completed', '2025-10-28 06:45:53', '2025-10-29 12:51:57', NULL, '/uploads/9079402677d84e3990a2e7ec686c129a', '/uploads/9b3ee8b3e916a1e5cbc1a7de4d556abf', '/uploads/7d4c8a77d5181082b5bc5aa688cef152', NULL, '/uploads/e4573b5805b3a1db0609f119335cf990', NULL, '/uploads/e05abb931baba9e30c7fefd7401f0ade'),
(34, 49, 11, 'IM/SPPS/2025/10/00008', 'scasd', 'dasd', 'dasd', '2025-10-27', 12, '312', '231 x 312 x 312', 'sda', 'das', 'das', NULL, 'Sugiaono', 'Approver User', 'completed', '2025-10-28 06:54:33', '2025-10-29 12:18:04', NULL, '/uploads/ff9eb796b1f23147109efb2052b6df4f', NULL, NULL, '/uploads/26d67756053c746bea196d64f5553109', '/uploads/2ac15f4a8b24685f4a41a54786b0e640', '/uploads/49bd241deb4b328fc887baf565c1775f', '/uploads/0465f1e63314ce3b77382f23fbe6e8eb'),
(37, 54, 11, 'IM/SPPS/2025/10/00011', '881021929MHK929012', 'Hyundai', 'Part bember depan Atto2', '2025-10-28', 312, '244242', '4322 x 2323 x 3232', 'eqw', 'dasd', 'dasdas', NULL, 'Sugiaono', '', 'submitted', '2025-10-29 09:07:16', '2025-10-29 09:07:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, 55, 15, 'IM/SPPS/2025/10/00012', '819291020-129-0192-09', 'PT Maspion Group', 'I’m Tutu Panci', '2025-10-29', 12, '1212', '431 x 21212 x 3131', 'Kardus', 'KRD-010212', 'Datiaso', NULL, 'Hummer Stark', 'Hureian', 'completed', '2025-10-29 13:33:11', '2025-10-30 06:18:07', NULL, '/uploads/522210a962dff02f1f7582de9e8e70eb', '/uploads/a4a29c1e586b465d5ea49b813b4d1351', '/uploads/293fc2cbe1d67d89f4155de1808bae64', '/uploads/e7aaacdefcb600e13d264612976c4053', '/uploads/f26e0c034f2861e1c824af571c8f4442', '/uploads/ded3ff0c033420fc7f08f3cd7b2933f0', '/uploads/56d952e6d137f45aa30b227793916ac4');

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

--
-- Dumping data untuk tabel `spps_draft`
--

INSERT INTO `spps_draft` (`id`, `user_id`, `data_json`, `updated_at`) VALUES
(5, 11, '{\"doc_no\":\"IM/SPPS/2025/10/00011\",\"date\":\"2025-10-28\",\"part_number\":\"881021929MHK929012\",\"supplier\":\"Hyundai\",\"part_description\":\"Part bember depan Atto2\",\"qty\":\"212\",\"part_weight\":\"244242\",\"part_dimension\":\"4322 x 2323 x 3232\",\"detail_parts\":\"part depan mobil atoo22\",\"created_by\":\"Sugiaono\",\"approved_by\":\"\",\"package_material\":\"material pasdasp\",\"package_code\":\"Code ini \",\"package_detail\":\"Detail\",\"illustration_part\":\"blob:http://localhost:5173/25ecd2c4-8053-4deb-ba17-4c11cb9cd1ca\",\"location\":\"Sulawesi\",\"code\":\"SLW-00912990\",\"name\":\"Sugiaono\",\"department\":\"Inventory Management\",\"telephone\":\"0876627716721\",\"description\":\"Ini part keratangan \",\"photo\":null,\"part_material\":[\"Plastic\",\"Other\"],\"inspection\":{\"visual_condition\":\"Second Hand\",\"part_system\":\"SVC-Hand\",\"length\":\"4322\",\"width\":\"2323\",\"height\":\"3232\",\"weight\":\"244242\",\"package_dimension\":\"4322 x 2323 x 3232\"},\"id\":700,\"user_id\":11,\"data_json\":\"{\\\"doc_no\\\":\\\"IM/SPIS/2025/10/00012\\\",\\\"date\\\":\\\"2025-10-21\\\",\\\"location\\\":\\\"Draft\\\",\\\"code\\\":\\\"dasda\\\",\\\"name\\\":\\\"Sugiaono\\\",\\\"department\\\":\\\"Inventory Management\\\",\\\"telephone\\\":\\\"0876627716721\\\",\\\"part_number\\\":\\\"212213\\\",\\\"supplier\\\":\\\"\\\",\\\"part_description\\\":\\\"\\\",\\\"description\\\":\\\"\\\",\\\"part_material\\\":[],\\\"inspection\\\":{\\\"visual_condition\\\":\\\"\\\",\\\"part_system\\\":\\\"\\\",\\\"length\\\":\\\"\\\",\\\"width\\\":\\\"\\\",\\\"height\\\":\\\"\\\",\\\"weight\\\":\\\"\\\",\\\"package_dimension\\\":\\\"\\\"},\\\"created_by\\\":\\\"Sugiaono\\\",\\\"approved_by\\\":\\\"\\\",\\\"id\\\":699,\\\"user_id\\\":11,\\\"data_json\\\":\\\"{\\\\\\\"doc_no\\\\\\\":\\\\\\\"IM/SPIS/2025/10/00008\\\\\\\",\\\\\\\"date\\\\\\\":\\\\\\\"2025-10-21\\\\\\\",\\\\\\\"location\\\\\\\":\\\\\\\"sada\\\\\\\",\\\\\\\"code\\\\\\\":\\\\\\\"dasd\\\\\\\",\\\\\\\"name\\\\\\\":\\\\\\\"Sugiaono\\\\\\\",\\\\\\\"department\\\\\\\":\\\\\\\"Inventory Management\\\\\\\",\\\\\\\"telephone\\\\\\\":\\\\\\\"0876627716721\\\\\\\",\\\\\\\"part_number\\\\\\\":\\\\\\\"2312\\\\\\\",\\\\\\\"supplier\\\\\\\":\\\\\\\"sdas\\\\\\\",\\\\\\\"part_description\\\\\\\":\\\\\\\"sdas\\\\\\\",\\\\\\\"description\\\\\\\":\\\\\\\"sda\\\\\\\",\\\\\\\"part_material\\\\\\\":[\\\\\\\"Glass\\\\\\\"],\\\\\\\"inspection\\\\\\\":{\\\\\\\"visual_condition\\\\\\\":\\\\\\\"sda\\\\\\\",\\\\\\\"part_system\\\\\\\":\\\\\\\"das\\\\\\\",\\\\\\\"length\\\\\\\":\\\\\\\"das21312\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"231\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"312\\\\\\\",\\\\\\\"weight\\\\\\\":\\\\\\\"312\\\\\\\",\\\\\\\"package_dimension\\\\\\\":\\\\\\\"das21312 x 231 x 312\\\\\\\"},\\\\\\\"created_by\\\\\\\":\\\\\\\"Sugiaono\\\\\\\",\\\\\\\"approved_by\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"detail_part\\\\\\\":\\\\\\\"dsa\\\\\\\",\\\\\\\"photo1\\\\\\\":{},\\\\\\\"photo1_url\\\\\\\":\\\\\\\"blob:http://localhost:5173/5c0b1eee-6294-48ac-8b99-ef12b067d8c2\\\\\\\",\\\\\\\"photo2\\\\\\\":{},\\\\\\\"photo2_url\\\\\\\":\\\\\\\"blob:http://localhost:5173/94b84fd5-38ca-4df1-937f-5eddff4e792e\\\\\\\",\\\\\\\"part_images\\\\\\\":[{\\\\\\\"url\\\\\\\":\\\\\\\"blob:http://localhost:5173/a3357fa2-f71b-41ea-a0eb-93531378720a\\\\\\\",\\\\\\\"description\\\\\\\":\\\\\\\"das\\\\\\\"}],\\\\\\\"photo_url\\\\\\\":null}\\\",\\\"updated_at\\\":\\\"2025-10-28T06:30:27.000Z\\\",\\\"part_images\\\":[],\\\"photo_url\\\":null}\",\"updated_at\":\"2025-10-28T07:10:30.000Z\",\"part_images\":[{\"file\":{},\"url\":\"\",\"description\":\"Kulit\"},{\"file\":{},\"url\":\"\",\"description\":\"Qris\"},{\"file\":{},\"url\":\"\",\"description\":\"sdas\"},{\"file\":{},\"url\":\"\",\"description\":\"fdsfas\"},{\"file\":{},\"url\":\"\",\"description\":\"gaade\"},{\"file\":{},\"url\":\"\",\"description\":\"dasc2\"},{\"file\":{},\"url\":\"\",\"description\":\"sadasdas\"},{\"file\":{},\"url\":\"\",\"description\":\"dasdasds\"}],\"detail_part\":\"part depan mobil atoo22\",\"photo1\":{},\"photo1_url\":\"blob:http://localhost:5173/25ecd2c4-8053-4deb-ba17-4c11cb9cd1ca\",\"photo2\":{},\"photo2_url\":\"blob:http://localhost:5173/450052b2-e9bd-42b1-b6ce-f3e2eeebd195\",\"other_material\":\"Carbon Kevlar\",\"package_0\":{},\"package_0_url\":\"blob:http://localhost:5173/7da8489f-14b4-45c7-82d5-1b27ce849efc\",\"package_1\":{},\"package_1_url\":\"blob:http://localhost:5173/04c9711a-c753-412a-aad0-e73acdedecb9\",\"package_2\":{},\"package_2_url\":\"blob:http://localhost:5173/b18a3c12-d310-4fd2-bd99-7e6b4ccd6b72\",\"package_3\":{},\"package_3_url\":\"blob:http://localhost:5173/a61bc5d9-664a-4905-abbe-189f7b7edd62\",\"package_illustration_0\":{},\"package_illustration_0_url\":\"blob:http://localhost:5173/c2a9db65-a092-46af-9aa8-927e244fb302\",\"package_illustration_1\":{},\"package_illustration_1_url\":\"blob:http://localhost:5173/8f24e9d3-3a1f-44cb-b882-dc8762a55042\",\"result_illustration\":{},\"result_illustration_url\":\"blob:http://localhost:5173/d5a3dcdc-0f73-4d23-94c8-8a49dd70e3a3\"}', '2025-10-29 09:06:33');

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
  `data_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `spqs`
--

INSERT INTO `spqs` (`id`, `spis_id`, `user_id`, `doc_no`, `part_number`, `date`, `part_description`, `supplier`, `criteria_dimension`, `criteria_weight`, `criteria_material`, `criteria_finishing`, `criteria_function`, `criteria_completeness`, `surface_wear`, `surface_damage`, `surface_scratch`, `surface_crack`, `surface_corrosion`, `surface_bend`, `result`, `comment`, `created_by`, `approved_by`, `checked_by`, `status`, `created_at`, `updated_at`, `data_json`) VALUES
(8, 46, 11, 'IM/SPQS/2025/10/00005', '2312', '2025-10-21', 'sdas', 'sdas', 'das21312 x 231 x 312', '312', 'Glass', 'sda', 'das', '', 0, 0, 0, 0, 0, 0, 'Pass', '', 'Sugiaono', '', '', 'submitted', '2025-10-28 06:30:00', '2025-10-28 06:30:00', '{\"user_id\":\"11\",\"spis_id\":\"46\",\"doc_no\":\"IM/SPQS/2025/10/00005\",\"part_number\":\"2312\",\"date\":\"2025-10-21\",\"part_description\":\"sdas\",\"supplier\":\"sdas\",\"criteria\":{\"package_dimension\":\"das21312 x 231 x 312\",\"weight\":\"312\",\"material\":\"Glass\",\"finishing\":\"sda\",\"function\":\"das\",\"completeness\":\"\",\"surface\":{\"wear\":false,\"damage\":false,\"scratch\":false,\"crack\":false,\"corrosion\":false,\"bend\":false}},\"result\":\"Pass\",\"comment\":\"\",\"created_by\":\"Sugiaono\",\"approved_by\":\"\",\"checked_by\":\"\",\"photo1_url\":\"blob:http://localhost:5173/5c0b1eee-6294-48ac-8b99-ef12b067d8c2\",\"photo2_url\":\"blob:http://localhost:5173/94b84fd5-38ca-4df1-937f-5eddff4e792e\"}'),
(9, 47, 11, 'IM/SPQS/2025/10/00006', '2312', '2025-10-21', 'sdas', 'sdas', 'das21312 x 231 x 312', '312', 'Glass', 'sda', 'das', '', 0, 1, 0, 0, 0, 0, 'Pass', 'sdsad', 'Sugiaono', '', '', 'submitted', '2025-10-28 06:33:50', '2025-10-28 06:33:50', '{\"user_id\":\"11\",\"spis_id\":\"47\",\"doc_no\":\"IM/SPQS/2025/10/00006\",\"part_number\":\"2312\",\"date\":\"2025-10-21\",\"part_description\":\"sdas\",\"supplier\":\"sdas\",\"criteria\":{\"package_dimension\":\"das21312 x 231 x 312\",\"weight\":\"312\",\"material\":\"Glass\",\"finishing\":\"sda\",\"function\":\"das\",\"completeness\":\"\",\"surface\":{\"wear\":false,\"damage\":true,\"scratch\":false,\"crack\":false,\"corrosion\":false,\"bend\":false}},\"result\":\"Pass\",\"comment\":\"sdsad\",\"created_by\":\"Sugiaono\",\"approved_by\":\"\",\"checked_by\":\"\",\"photo1_url\":\"blob:http://localhost:5173/5c0b1eee-6294-48ac-8b99-ef12b067d8c2\",\"photo2_url\":\"blob:http://localhost:5173/94b84fd5-38ca-4df1-937f-5eddff4e792e\"}'),
(10, 48, 11, 'IM/SPQS/2025/10/00007', 'sdasd', '2025-10-21', 'dasd', '21312', '213 x 2131 x 312', '3123', 'Glass', 'sdas', 'asd', '', 1, 0, 0, 0, 1, 0, 'Pass', 'dasd', 'Sugiaono', 'Hureian', '', 'completed', '2025-10-28 06:46:05', '2025-10-29 12:51:57', '{\"user_id\":\"11\",\"spis_id\":\"48\",\"doc_no\":\"IM/SPQS/2025/10/00007\",\"part_number\":\"sdasd\",\"date\":\"2025-10-21\",\"part_description\":\"dasd\",\"supplier\":\"21312\",\"criteria\":{\"package_dimension\":\"213 x 2131 x 312\",\"weight\":\"3123\",\"material\":\"Glass\",\"finishing\":\"sdas\",\"function\":\"asd\",\"completeness\":\"\",\"surface\":{\"wear\":true,\"damage\":false,\"scratch\":false,\"crack\":false,\"corrosion\":true,\"bend\":false},\"weight_ok\":true},\"result\":\"Pass\",\"comment\":\"dasd\",\"created_by\":\"Sugiaono\",\"approved_by\":\"\",\"checked_by\":\"\",\"photo1_url\":\"blob:http://localhost:5173/579abbfc-7558-44f5-904a-7ffe27d8f6ce\",\"photo2_url\":\"blob:http://localhost:5173/2e12bbf8-e30a-4ee0-8a8d-e98c87e0c87e\"}'),
(11, 49, 11, 'IM/SPQS/2025/10/00008', 'scasd', '2025-10-27', 'dasd', 'dasd', '231 x 312 x 312', '312', 'Glass', 'dsd', 'das', '', 0, 1, 0, 0, 0, 0, 'Pass', 'das', 'Sugiaono', 'Approver User', '', 'completed', '2025-10-28 06:54:44', '2025-10-29 12:18:04', '{\"user_id\":\"11\",\"spis_id\":\"49\",\"doc_no\":\"IM/SPQS/2025/10/00008\",\"part_number\":\"scasd\",\"date\":\"2025-10-27\",\"part_description\":\"dasd\",\"supplier\":\"dasd\",\"criteria\":{\"package_dimension\":\"231 x 312 x 312\",\"weight\":\"312\",\"material\":\"Glass\",\"finishing\":\"dsd\",\"function\":\"das\",\"completeness\":\"\",\"surface\":{\"wear\":false,\"damage\":true,\"scratch\":false,\"crack\":false,\"corrosion\":false,\"bend\":false},\"package_dimension_ok\":true,\"completeness_remark\":\"dasd\",\"function_remark\":\"das\"},\"result\":\"Pass\",\"comment\":\"das\",\"created_by\":\"Sugiaono\",\"approved_by\":\"\",\"checked_by\":\"\",\"photo1_url\":\"blob:http://localhost:5173/3471ef16-8580-4bb1-bf98-fb2718fab1af\",\"photo2_url\":\"blob:http://localhost:5173/aa9e3aa7-6c6f-431d-ba4a-da3f8a3def8b\"}'),
(14, 55, 15, 'IM/SPQS/2025/10/00010', '819291020-129-0192-09', '2025-10-29', 'I’m Tutu Panci', 'PT Maspion Group', '431 x 21212 x 3131', '1212', 'Rubber, Metal, Plastic, Glass, Other', 'Good Condition', 'PRAT-21910220', '', 0, 1, 0, 1, 0, 0, 'Need Improvement', 'Ini comment saya', 'Hummer Stark', 'Hureian', '', 'completed', '2025-10-29 13:33:49', '2025-10-30 06:18:07', '{\"user_id\":\"15\",\"spis_id\":\"55\",\"doc_no\":\"IM/SPQS/2025/10/00010\",\"part_number\":\"819291020-129-0192-09\",\"date\":\"2025-10-29\",\"part_description\":\"I’m Tutu Panci\",\"supplier\":\"PT Maspion Group\",\"criteria\":{\"package_dimension\":\"431 x 21212 x 3131\",\"weight\":\"1212\",\"material\":\"Rubber, Metal, Plastic, Glass, Other\",\"finishing\":\"Good Condition\",\"function\":\"PRAT-21910220\",\"completeness\":\"\",\"surface\":{\"wear\":false,\"damage\":true,\"scratch\":false,\"crack\":true,\"corrosion\":false,\"bend\":false},\"package_dimension_ok\":true,\"weight_ok\":true,\"material_remark\":\"tifak\",\"finishing_remark\":\"uijpo\",\"function_remark\":\"fucjtasio\",\"completeness_remark\":\"complet\"},\"result\":\"Need Improvement\",\"comment\":\"Ini comment saya\",\"created_by\":\"Hummer Stark\",\"approved_by\":\"\",\"checked_by\":\"\",\"photo1_url\":\"blob:http://localhost:5173/c57c10c1-8dd4-4d45-8b66-ab5a3583d92f\",\"photo2_url\":\"blob:http://localhost:5173/da985e1b-6961-4816-9b88-80bd977f7dd7\"}');

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
(11, 'admin', 'Sugiaono', 'Inventory Management', '0876627716721', 'admin@example.com', '$2b$10$3ecgulsqqqSAcJzHTdA5/uMMEgJKqcpVmaeZwDqZL59aAdGblYCZC', 'admin', '/uploads/signatures/1761724020439.png', '2025-10-25 02:31:30'),
(12, 'approver user', 'Hureian', 'Approved', '021812992121', 'approver@example.com', '$2b$10$LG3HzWx1jietCucWXNJgZ.SLNGv64zrHypZB2FHtDvkchQKerdEJy', 'approval', '/uploads/signatures/1761731880725.png', '2025-10-25 02:32:28'),
(13, 'viewer', 'Viewer User', NULL, NULL, 'viewer@example.com', '$2b$10$gv5MYi3ibKQyXySBgDHClui6rhiWPtoa6dnJoBITmAZjyq.uGUziS', 'viewer', NULL, '2025-10-25 02:33:04'),
(14, 'view melihat', 'Melihat', NULL, NULL, 'tamu@example.com', '$2b$10$gYTgPRNrzPYFg.Zt5xMTj.SArWjQapgMqdO1a5nuJMy3fvGL76UU6', 'viewer', NULL, '2025-10-29 12:55:50'),
(15, 'Hummerstark', 'Hummer Stark', 'Penerangan', '086727881289129', 'hummer@example.com', '$2b$10$p4A31KCAtOFZUu0afr4RNeMxAEhfu9msZfx9uTk7KchSSqfwyt9ue', 'admin', '/uploads/signatures/1761744561434.png', '2025-10-29 13:28:16');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT untuk tabel `spis_draft`
--
ALTER TABLE `spis_draft`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=701;

--
-- AUTO_INCREMENT untuk tabel `spps`
--
ALTER TABLE `spps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT untuk tabel `spps_draft`
--
ALTER TABLE `spps_draft`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `spqs`
--
ALTER TABLE `spqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
