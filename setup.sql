CREATE TABLE IF NOT EXISTS `server` (
	`id` VARCHAR(36) NOT NULL,
	`address` CHAR(45),
	`port` INT NOT NULL,
	`providertoken` VARCHAR(36),
	`notlegacy` TINYINT(1) DEFAULT 0,
	`lastupdate` BIGINT NOT NULL,
	PRIMARY KEY (id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS `server_settings` (
	`id` MEDIUMINT NOT NULL AUTO_INCREMENT,
	`serverid` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`id`),
	CONSTRAINT `FK_SERVER_ID_SETTINGS` FOREIGN KEY (`serverid`) REFERENCES `server` (`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS `server_details` (
	`id` MEDIUMINT NOT NULL AUTO_INCREMENT,
	`serverid` VARCHAR(50) NOT NULL,
	`players` INT,
	`slots` INT,
	`memory` BIGINT,
	PRIMARY KEY (`id`),
	CONSTRAINT `FK_SERVER_ID_DETAILS` FOREIGN KEY (`serverid`) REFERENCES `server` (`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS `hosting_providers` (
	`id` MEDIUMINT NOT NULL AUTO_INCREMENT,
	`providertoken` VARCHAR(36),
	`providername` VARCHAR(40) NOT NULL,
	`color` VARCHAR(7) NOT NULL,
	`highlight` VARCHAR(7) NOT NULL,
	`official` TINYINT(1) DEFAULT 0,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS `archive` (
	`currentplayers` INT NOT NULL,
	`currentslots` INT NOT NULL,
	`currentservers` INT NOT NULL,
	`timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DELIMITER !!

CREATE EVENT IF NOT EXISTS timeout_server
ON SCHEDULE EVERY 1 MINUTE
DO BEGIN
    DELETE FROM server WHERE lastupdate < UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 20 MINUTE));
END!!

CREATE EVENT IF NOT EXISTS archive_stats
ON SCHEDULE EVERY 5 MINUTE
DO BEGIN
    SET @curplayer = 0;
    SET @curslot = 0;
    SET @curserver = 0;

    SELECT SUM(players) INTO @curplayer FROM server_details;
    SELECT SUM(slots) INTO @curslot FROM server_details;
    SELECT COUNT(*) INTO @curserver FROM server;

    #INSERT INTO archive (currentplayers, currentslots, currentservers) VALUES (SUM(server_details.players),SUM(server_details.slots),COUNT(server.id));
    INSERT INTO archive (currentplayers, currentslots, currentservers) VALUES (@curplayer,@curslot,@curserver);
END!!

DELIMITER ;
