window.I18n.load({
  namespace: 'DV',
  code: 'ukr',
  nplurals: 3,
  initialize: function(){
    if ( window.dc && window.dc.inflector ){
      window.dc.inflector.possessivize = function(string){ return string; };
    }
  },
  pluralizer: function(n){
    return (n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
  },
  strings: {"CLOSE":"ЗАКРИТИ","add_note_instructions":"Виділить частину сторінки або клацніть на зону між сторінками, щоб створити нову нотатку","add_private_note":"Додати приватну нотатку","add_private_note_warn":"Ваші приватні нотатки можете бачити тільки ви і ніхто крім вас.","add_public_note":"Додати публічну нотатку","add_public_note_warn":"Публічні нотатки буде видно всім, хто побачить ций документ","annotated_by":"Автор нотатки: %s","annotation_title":"Назва нотатки","cancel":"Скасувати","click_add_page_note":"Клацніть, щоб додати нотатку","container_not_found":"Елемент у віконці  перегляду документів не знайдений:","contents":"Зміст","contributed_by":"Додано","delete":"Видалити","description":"Опис","dl_as_pdf":"Завантажити цей документ у вигляді PDF","document":"Документ","document_tools":"Інструменти","draft":"Чернетка","draft_note_visible":"Ця чернетка доступна тільки вам та користувачам, яких ви авторизували","edit_data":"Редагувати","expand":"На все вікно","finish":"Готово","for":"для","install_chrome_frame":"Або, якщо ж ви хочете і далі використовувати Internet Explorer 6, ви можете %sвстановити Google Chrome Frame%s.","link_to_note":"Посилання на цю нотатку","loading":"Завантаження","log_in":"Ввійти","log_out":"Вийти","logged_in_as":"Ви увійшли як  %s","must_upgrade":"Щоб використовувати вікно перегляду документів , вам потрібно оновити браузер:","next":"Далі","next_note":"Наступна нотатка","note":["Нотатка","Нотатки"],"note_by":"Нотатку залишив %s","of":"з","organizations_documents":"Документи %s","original_document_pdf":"Оригінал документу (PDF)","page":["сторінка","сторінки"],"pg":"с.","previous":"Назад","previous_note":"Попередня замітка","print_document_help":"Щоб роздрукувати документ, натисніть на посиланні \"Оригінал документу\" - буде відкрито документ PDF. Майте на увазі , що в такому вигляді надрукувати замітки буде не можна.","print_notes":"Надрукувати нотатки","private_note":"Приватна нотатка","private_note_visible":"Цю приватну нотатку можете бачити тільки ви ","publish":"Опублікувати","related_article":"Пов'язані статті","reviewer":"Рецензент","save":"Зберегти","save_as_draft":"Зберегти чернетку","search":"Пошук","text":"Текст","untitled_note":"Нотатка без назви","view_fullscreen":"Відкрити документ на весь екран","x_collaborators":["Один авторизований користувач","%d Авторизованих користувачів"],"x_documents":["%d документ","%d документа","%d документів"],"x_notes":["%d нотатка","%d нотатки","%d нотаток"],"x_pages":["%d сторінка","%d сторінки","%d сторінок"],"zoom":"Масштаб"}

});
