window.I18n.load({
  namespace: 'DV',
  code: 'rus',
  nplurals: 3,
  initialize: function(){
    if ( window.dc && window.dc.inflector ){
      window.dc.inflector.possessivize = function(string){ return string; };
    }
  },
  pluralizer: function(n){
    return (n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
  },
  strings: {"CLOSE":"ЗАКРЫТЬ","add_note_instructions":"Выделите часть документа или щелкните на пространстве между страницами, чтобы создать заметку","add_private_note":"Добавить приватную заметку","add_private_note_warn":"Ваши приватные заметки видны только вам и никому кроме вас.","add_public_note":"Добавить публичную заметку","add_public_note_warn":"Публичные заметки будут видны всем, кто увидит этот документ","annotated_by":"Автор заметки: %s","annotation_title":"Название заметки","cancel":"Отмена","click_add_page_note":"Щелкните, чтобы добавить заметку","container_not_found":"Элемент в окне просмотра документов не найден:","contents":"Содержание","contributed_by":"Добавлено","delete":"Удалить","description":"Описание","dl_as_pdf":"Скачать этот документ в виде PDF","document":"Документ","document_tools":"Инструменты","draft":"Черновик","draft_note_visible":"Этот черновик доступен только вам и пользователям, которых вы авторизовали","edit_data":"Редактировать","expand":"На все окно","finish":"Готово","for":"для","install_chrome_frame":"Или, если вы все таки хотите дальше использовать Internet Explorer 6, вы можете %sустановить Google Chrome Frame%s.","link_to_note":"Ссылка на эту заметку","loading":"Загрузка","log_in":"Войти","log_out":"Выйти","logged_in_as":"Вы вошли как %s","must_upgrade":"Чтобы использовать окошко просмотра документов, вам нужно обновить браузер:","next":"Далее","next_note":"Следующая заметка","note":["Заметка","Заметки"],"note_by":"Заметку оставил %s","of":"из","organizations_documents":"Документы %s","original_document_pdf":"Оригинал документа (PDF)","page":["страница","страницы"],"pg":"с.","previous":"Назад","previous_note":"Предыдущая заметка","print_document_help":"Чтобы распечатать документ, нажмите на ссылке \"Оригинал документа\" - будет открыт документ PDF. Имейте ввиду, что в таком виде напечатать заметки будет нельзя.","print_notes":"Напечатать заметки","private_note":"Приватная заметка","private_note_visible":"Эта приватная заметка видна только вам","publish":"Опубликовать","related_article":"Связанные статьи","reviewer":"Рецензент","save":"Сохранить","save_as_draft":"Сохранить черновик","search":"Поиск","text":"Текст","untitled_note":"Заметка без названия","view_fullscreen":"Открыть документ на весь экран","x_collaborators":["Один авторизованный пользователь","%d Авторизованных пользователей"],"x_documents":["%d документ","%d документа","%d документов"],"x_notes":["%d заметка","%d заметки","%d заметок"],"x_pages":["%d страница","%d страницы","%d страниц"],"zoom":"Масштаб"}

});
