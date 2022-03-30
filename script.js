document.addEventListener('DOMContentLoaded', () =>{

 /* --------------------------- INPUT---------------------------------------------------------------------------- */
  
 //const buttons = document.querySelectorAll('.button-col label');
  
  /* function changeClass(el){
    let i = el.querySelector('i');
    let all_i = document.querySelectorAll('.button-col label i');
    all_i.forEach((each_i) => {
      each_i.classList.replace('fa-duotone', 'fa-regular');
    })
  
    i.classList.replace('fa-regular', 'fa-duotone');
  }
  
  
  
  buttons.forEach((el) => {
    el.addEventListener('click', (e) => {
        changeClass(el);
    })
  }) */
  
/* --------------------------- INPUT---------------------------------------------------------------------------- */
const buttons = document.querySelectorAll('.button-col label');

buttons.forEach((el) => {
  el.addEventListener('click', () => {
    let all_icon = document.querySelectorAll('.button-col label i');

    all_icon.forEach(item => {
        item.classList.replace('fa-duotone', 'fa-regular');
        el.querySelector('i').classList.replace('fa-regular', 'fa-duotone');
    })
  
  })

})

  
/* --------------------------LABEL----------------------------------------- */
  
  const inputs = document.querySelectorAll('.field-input input');
  
  inputs.forEach((item)=>{
    item.addEventListener('focus', () => {
        item.closest('.field-input').classList.add('focused');
    });

    item.addEventListener('blur', () => {
      if(item.value === '')
        item.closest('.field-input').classList.remove('focused');
    });
  })
 


/* --------------------DATA ----------------------------------------------- */
  
  //date
  FormData.prototype.toString = function () {
    let entries = [];
    for(let pair of this.entries()) {
         entries.push(pair[0] + ' => ' + pair[1]);
    }
    return entries.join(', ');
}

    let stop_form = false;
    let current    = 0;     
    let at_time    = 0;      //данные из инпутов
    let interval   = 0;
    let users_list = [];  //изначальный массив
    let progress = document.querySelector('.progress-done');
    let response = document.querySelector('.response');
    let error = 0;
    let button_start = document.querySelector('#send-form');
    let button_stop = document.querySelector('#stop-form');
    let current_send = document.querySelector('#current-send');

    let mm_form_data = '';

    const mm_form = document.getElementById('messengers-mailings-form');
  
  
  mm_form.addEventListener('submit', (e) => {
      e.preventDefault();

      progress.textContent = '';
      progress.style.width = 0;
      current_send.textContent = 0;
        
      sendForm(mm_form);

      button_start.addEventListener('click', ()=>{
        e.preventDefault();
        stop_form = false
      })

  });

   
  
  button_start.addEventListener('click', ()=>{
      if (button_start.value === 'Продолжить') {
        button_start.value = 'Отправить';
        button_stop.value = 'Пауза'
      }else if(button_start.value === 'Отправить'){
        button_stop.value = 'Пауза'
      } 
    })


 
  button_stop.addEventListener('click', ()=>{
    if( button_stop.value === 'Закончить'){
      current = 0;
      button_start.value = 'Отправить';
      button_stop.value = 'Очистить';
    
    }else if( button_stop.value === 'Очистить' && current == 0){
      mm_form.reset();
    
    }else{
      stop_form = true;
      button_start.value = 'Продолжить';
      button_stop.value = 'Закончить'
      console.log('pause')
    }
  });
 

  const list_area = document.querySelector('#list-area');
  
  list_area.addEventListener('input', () =>{
    //users_list = data.get('list-area').split('\r\n'); const rows = text.split(/\r\n|\r|\n/g);
    if(current == 0){
        users_list = list_area.value.split(/\r\n|\r|\n/g); 
        console.log(users_list);
        document.querySelector('#total-send').textContent = users_list.length;
        current_send.textContent = 0;
        //.innerText(users_list.length)
        console.log('dfghjkl')
    }
  });


  function sendForm(form){

    if(stop_form){
      console.log('in if: ', stop_form);
      return  ////return выполнит то, что написано до ;
    } 


    if(current === 0) //без скобок выполняется только первая строка
        mm_form_data = new FormData(form); //зарезервировать форм date/  and overlay /статистику/ проверку/ переменные
        at_time = +mm_form_data.get('at-time');
        interval = +mm_form_data.get('interval')*1000;
        //let progress_one = 100 / (users_list.length / +at_time) + '%';
        //console.log(users_list) ;//взять из date значение list area
        mm_form_data.set('list-area', JSON.stringify(users_list.slice(current, current + at_time))); 
    

      
    
    fetch('ajax.php', {
        method: 'POST',
        body: mm_form_data
      }).then(function (response) {
          return response.json()
      }).then(function (data) {
          console.log('data', data); //данные что вернул сервер
          error = error + data.error;
          response.textContent = error;
          console.log('success');
            
          
        setTimeout(() => {
            if(stop_form) return;
                
            current += at_time;
            current_send.textContent = current > users_list.length ? users_list.length : current;
            let progress_one = Math.round(+current * 100 / users_list.length); //33

            if (progress_one > 100) progress_one = 100;
                  progress.style.width = progress.textContent = `${progress_one}%`
                  console.log(current);
            
            if (current >= users_list.length) {
                  current = 0;
                  button_stop.value = 'Очистить';
                  alert('Рассылка обканчена');
            } else {
                  sendForm(form)
            }
          }, interval)
          
        }).catch(() => {
          console.log('error')
        })

      }

  });




