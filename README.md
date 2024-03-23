Выпускаю часть сурсов приложения, которые уже давно outdated.

### Что здесь
  - Приложение написано на electron + React.
  - есть небольшой модуль на C++ (от которого осталось лишь упоминание), который дёргает апи v8 и который, по сути, даже не нужен был
  - использование UiKit - Ant design

### Что изменилось
  - перенос с electron на tauri (с последующием переписыванием часть логики на Rust) и уменьшением веса приложения с ~200 мб до ~10 мб
  - переписано с использованием Next.js 14 (Что мало полезно ввиду отсутствия возможности использовать SSR)
  - всем стейтом управляет react-query (вызовы API сервера и бекенда tauri) и немного mobx
  - используется openapi-generator с самописным генератором для создания обёртки над react-query
  - вместо less используется scss и tailwindcss
  

### Вывод cloc

Language                     files          blank        comment           code

TypeScript                      79           1526            209           6933
CSS                              7            127             15           1061
LESS                             5             65              0            435
JavaScript                       8             15              6            211
SVG                              1              0              0             23
EJS                              1              2              8             18
Markdown                         1              3              0             11
INI                              1              2              0             10
XML                              1              0              0             10

SUM:                           104           1740            238           8712
