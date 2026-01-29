USE mon_cinema;
-- EXEMPLES A NE PAS RENDRE !!
-- Films pour tester
INSERT INTO movies (title, description, duration, release_year, genre, director) VALUES
("Harriet", "Vers 1849, Araminta 'Minty' Ross est esclave sur la plantation de la famille Brodess. Très croyante, elle a des visions depuis un violent choc à la tête lorsqu'elle était adolescente et pense que Dieu lui envoie des messages. Elle est mariée avec John Tubman, un esclave affranchi. Le père de Minty, également affranchi, demande à M. Brodess de respecter le testament de son père en vertu duquel il aurait dû affranchir la mère de Minty et ses enfants lorsque celle-ci a eu 45 ans", 125, 2019, "Biopic", "Kasi Lemmons"),
("20th Century Girl", "En 1999, Bo-ra, 17 ans, s'attelle à la tâche la plus importante de son adolescence, car l'amitié est plus forte que tout, plus forte même que l'amour. Quand Yeon-doo se rend à l'étranger pour être opérée du cœur, Bo-ra promet de surveiller le premier amour de son amie et de lui raconter tous ses faits et gestes.", 119, 2022, "Romance", "Woo-ri Bang"),
("Le Roi Lion", "L'histoire d un lionceau destiné à devenir roi", 88, 1994, "Animation", "Roger Allers");


-- Salles pour tester
INSERT INTO rooms (name, capacity, room_type, active) VALUES
("Salle 1", 100, "Standard", TRUE),
("Salle 2", 100, "3D", TRUE),
("Salle 3", 150, "4D", FALSE);


-- Séances pour tester
INSERT INTO screenings (movie_id, room_id, start_time, end_time, active) VALUES
(1, 1, '2026-02-01 18:00:00', '2026-02-01 20:05:00', TRUE),
(2, 2, '2026-02-01 20:30:00', '2026-02-01 22:30:00', TRUE),
(3, 1, '2026-02-02 16:00:00', '2026-02-02 17:30:00', FALSE);
