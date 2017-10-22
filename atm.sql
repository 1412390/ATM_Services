-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 22, 2017 at 07:37 AM
-- Server version: 10.1.26-MariaDB
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `atm`
--

-- --------------------------------------------------------

--
-- Table structure for table `card`
--

CREATE TABLE `card` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date_create` int(11) NOT NULL,
  `date_expiry` int(11) NOT NULL,
  `available_balance` varchar(255) NOT NULL COMMENT 'Là số dư có thực tế trên tài khoản tiền gửi của khách hàng',
  `current_balance` varchar(255) NOT NULL COMMENT 'Là số dư trên tài khoản tiền gửi thanh toán mà khách hàng được phép sử dụng. Trong trường hợp khách hàng được cấp hạn mức thấu chi thì số dư khả dụng bằng tổng số dư thực cộng với hạn mức thấu chi trừ đi số tiền bị phong tỏa trên tài khoản (nếu có ). ',
  `bank` int(11) NOT NULL COMMENT '0: ACB; 1: VietComBan; 2: VietTinBank'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `card`
--

INSERT INTO `card` (`id`, `user_id`, `date_create`, `date_expiry`, `available_balance`, `current_balance`, `bank`) VALUES
(1, 1, 329382, 323232, '2496700', '-83718200', 0),
(2, 2, 329382, 323232, '5600000', '5600000', 0),
(3, 3, 3232, 3232, '100000', '100000', 2);

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `date` int(11) NOT NULL,
  `value` varchar(255) CHARACTER SET utf8 NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`id`, `date`, `value`, `user_id`, `content`) VALUES
(1, 1508217350, '1000000', 1, 'Giao dịch rút tiền lúc 17-10-2017 12:15 số tiền 1000000'),
(2, 1508218394, '1000000', 1, 'Giao dịch chuyển tiền nội bộ lúc 17-10-2017 12:33 số tiền 1000000 Người nhận: 2'),
(3, 1508218497, '5000000', 1, 'Giao dịch chuyển tiền liên ngân hàng lúc 17-10-2017 12:34 số tiền 5000000 ID người nhận: 3'),
(4, 1508224111, '1000000', 1, 'Giao dịch rút tiền lúc 17-10-2017 14:08 số tiền 1000000'),
(5, 1508224375, '1000000', 1, 'Giao dịch rút tiền lúc 17-10-2017 14:12 số tiền 1000000'),
(6, 1508398769, '1000000', 1, 'Giao dịch rút tiền lúc 19-10-2017 14:39 số tiền 1000000'),
(7, 1508398811, '1000000', 1, 'Giao dịch rút tiền lúc 19-10-2017 14:40 số tiền 1000000'),
(8, 1508400381, '100000', 1, 'Giao dịch chuyển tiền nội bộ lúc 19-10-2017 15:06 số tiền 100000 ID người nhận: 2'),
(9, 1508400787, '10000000', 1, 'Giao dịch chuyển tiền liên ngân hàng lúc 19-10-2017 15:13 số tiền 10000000 ID người nhận: 3'),
(10, 1508400840, '10000000', 1, 'Giao dịch chuyển tiền liên ngân hàng lúc 19-10-2017 15:14 số tiền 10000000 ID người nhận: 3'),
(11, 1508400941, '100000', 1, 'Giao dịch chuyển tiền liên ngân hàng lúc 19-10-2017 15:15 số tiền 100000 ID người nhận: 3'),
(12, 1508467359, '1000000', 1, 'Giao dịch rút tiền lúc 20-10-2017 9:42 số tiền 1000000'),
(13, 1508467396, '2000000', 1, 'Giao dịch rút tiền lúc 20-10-2017 9:43 số tiền 2000000'),
(14, 1508467408, '5500000', 1, 'Giao dịch chuyển tiền nội bộ lúc 20-10-2017 9:43 số tiền 5500000 ID người nhận: 2');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `dob` int(11) NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `name`, `dob`, `email`) VALUES
(1, 'anhbap12346', 'hoilamgithe', 'thái nguyễn hoàng hát', 1508564592, 'thainguyenhoangphat1996@gmail.com'),
(2, 'cmg255', '193f96d542349d9c7fc8394097a538c2', 'Công Ngủ', -2147483648, 'cmg255@gmail.com'),
(3, 'anhbap12345', '193f96d542349d9c7fc8394097a538c2', 'ngu người', 1206896400, 'abc@gmail.com'),
(4, 'lythanhnhan', 'hoilamgi', 'lý thánh nhân', 762282000, 'lythanhnhan123@gmail.com'),
(6, 'lythanhnhan12345', 'hoilamgi', 'lý thánh nhân', 762282000, 'lythanhnhan123@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_card_user_id` (`user_id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_history_user` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `card`
--
ALTER TABLE `card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `card`
--
ALTER TABLE `card`
  ADD CONSTRAINT `fk_card_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `fk_history_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
