<?php																				// открываем php синтаксис
$_POST = json_decode(file_get_contents("php://input"), true ); // то что приходит нам от клиента мы декодируем
echo var_dump($_POST);														// позволяет увидеть данные которые приходят с клиента