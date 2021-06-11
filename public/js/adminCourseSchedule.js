window.onload = () => {
    setupHeader();
    getInstructor();
    let addBookingBtn = document.getElementById('add-order-btn');
    addBookingBtn.addEventListener('click', addBooking);
    getClassList();
    setupTooltip();
    let addExistStudentBtn = document.getElementById('add-exist-student');
    addExistStudentBtn.addEventListener('click', addExistStudent);
    let newStudentBtn = document.getElementById('new-student-btn');
    newStudentBtn.addEventListener('click', addNewStudent);


    setupClassroomList();
    setupPoolList();
    let bookModal = document.getElementById('bookClassroomModal');
    bookModal.addEventListener('show.bs.modal', setupModal);
}


let setupHeader = () => {
    let id = document.getElementsByClassName('marker')[0].id;
    //console.log(id);
    axios.get(`/admin/api/course/schedule/${id}`).then((data) => {
        //console.log(data.data);
        let date = new Date(data.data[0].start_date);
        date.setDate(date.getDate() + 1);
        date = date.toISOString().slice(0, 10);
        document.getElementsByClassName('content-header')[0].innerHTML = headerTemplate({ course_name: data.data[0].course, start_date: date })
    })


}
let headerTemplate = Handlebars.compile(`
    <h1>{{course_name}} <span class="px-4">{{start_date}}</span></h1>
`)

let getInstructor = () => {
    axios.get('/admin/api/instructor').then((data) => {
        //console.log('instructors', data.data);
        let instructorPicker = document.getElementById('instructor-picker');
        for (let i = 0; i < data.data.length; i++) {
            let newOption = document.createElement('option');
            newOption.value = data.data[i].id;
            newOption.text = data.data[i].full_name;
            instructorPicker.appendChild(newOption);
        }
    })
}
let orderTemplate = Handlebars.compile(`

<div class="card-header">
    <h3 class="card-title">
        Order
    </h3>
    <div class="card-tools">
        <button type="button" class="btn btn-tool" data-card-widget="collapse"><i
                class="fas fa-minus"></i></button>
        <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times"></i></button>
    </div>

</div>
<div class="card-body">
    <fieldset>
        <input placeholder="Customer name" type="text" tabindex="1" name="full_name" required>
    </fieldset>
    <fieldset>
        <input placeholder="Customer Email Address" type="email" tabindex="2" name="email" required>
    </fieldset>
    <fieldset>
        <input placeholder="Customer Phone Number" type="tel" tabindex="3" name="phone_number" required>
    </fieldset>
    
    <fieldset>
        <input placeholder="num of people" tabindex="4" name="num_people"
            required></input>
    </fieldset>
    
</div>

`)
let addBooking = (e) => {
    //e.preventDefault();
    let place = document.getElementById('order-form');
    let newCard = document.createElement('div');
    newCard.classList.add('card', 'card-info')
    newCard.innerHTML = orderTemplate();
    place.appendChild(newCard);
}
let getClassList = async () => {
    //id is class_course id
    let id = document.getElementsByClassName('marker')[0].id;
    //console.log(id);
    let classList = await axios.get(`/admin/api/course/schedule/${id}/class`);
    //console.log('classList', classList.data);
    let promises = [];
    for (let i = 0; i < classList.data.length; i++) {
        let course_schedule_id = classList.data[i].id
        let getOrder = axios.get(`/admin/api/course/class/${course_schedule_id}`);
        promises.push(getOrder);
    }
    let orderGot = await Promise.all(promises);
    //console.log('orderGot', orderGot);
    for (let i = 0; i < classList.data.length; i++) {
        let classId = classList.data[i].id

        let instructorName = classList.data[i].instructor.full_name
        let outerCard = document.createElement('div');
        let classParent = document.getElementById('class-list');
        outerCard.classList.add('card');
        outerCard.setAttribute('data-Class-id', classId);
        outerCard.innerHTML = classTemplate({ instructor_name: instructorName });
        //console.log('outerCard');
        let orderParent = outerCard.querySelector('#course-order-marker');
        let orderList = orderGot[i].data;
        for (let j = 0; j < orderList.length; j++) {
            let orderId = orderList[j].id;
            let orderName = orderList[j].full_name;
            let phone = orderList[j].phone_number;
            let email = orderList[j].email;
            let num_people = orderList[j].num_people;
            let innerCard = document.createElement('div');
            innerCard.classList.add('card');
            innerCard.setAttribute('data-order-id', orderId);
            innerCard.innerHTML = orderListTemplate({
                OrderName: orderName,
                phone: phone,
                email: email,
                num: num_people,
                orderId: orderId
            });
            orderParent.appendChild(innerCard);
        }
        classParent.appendChild(outerCard);
    }
    setupClassList();
    getStudent();
    setupTooltip();
    setupStudentModal();
    setupClassroomBooking();
}
let setupTooltip = () => {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

let classTemplate = Handlebars.compile(`

<div class="card-header">
    <h3 class="card-title">Instructor: {{instructor_name}}</h3>
    <div class="card-tools">
        <button type="button" class="btn btn-tool" data-card-widget="collapse"><i
                class="fas fa-minus"></i></button>
    </div>
</div>
<div class="card-body" id="course-order-marker">
    
</div>

`)

let orderListTemplate = Handlebars.compile(`

<div class="card-header">
    <h3 class="card-title" data-bs-toggle="tooltip" data-bs-placement="right" title="phone:{{phone}} email:{{email}} num:{{num}}">{{OrderName}}</h3>
    <div class="card-tools">
        <button class="btn btn-tool" data-bs-toggle="modal" data-bs-target="#addStudentModal" data-bs-orderId={{orderId}}>add student</button>
        <button type="button" class="btn btn-tool" data-card-widget="collapse"><i
        class="fas fa-minus"></i></button>
    </div>
</div>
<div class="card-body">
    <table class="table table-bordered text-center">
        <thead>
            <tr>
                <th>name</th>
                <th>phone</th>
                <th>email</th>
            </tr>
        </thead>
        <tbody id="student-marker">
            
        </tbody>
    </table>
</div>

`)

let studentTemplate = Handlebars.compile(`
    {{#each student}}
            <tr>
                <th>{{full_name}}</th>
                <th>{{phone_number}}</th>
                <th>{{email}}</th>
            </tr>
    {{/each}}
    
`)
let existStudentEmailTemplate = Handlebars.compile(`
<input type="email" name="student_email" placeholder="email" class="col-8">
`)

let addExistStudent = () => {
    let existStudentParent = document.getElementById('exist-student-list');
    let newExist = document.createElement('input');
    newExist.classList.add('col-8');
    newExist.setAttribute('type', 'email');
    newExist.setAttribute('name', 'student_email');
    newExist.setAttribute('placeholder', 'email');
    existStudentParent.appendChild(newExist);
}

let newStudentTemplate = Handlebars.compile(`
<div class="card-header">
<h3 class="card-title">student</h3>
<div class="card-tools">
    <button type="button" class="btn btn-tool" data-card-widget="collapse"><i
            class="fas fa-minus"></i></button>
</div>
</div>
<div class="card-body">
<input type="text" placeholder="name" name="name">
<input type="tel" placeholder="phone" name="phone">
<input type="email" placeholder="email" name="email">
<label for="mask">mask</label>
<input type="checkbox" id="mask" name="mask">
<label for="regulator">regulator</label>
<input type="checkbox" id="regulator" name="regulator">
<input type="text" placeholder="bcd size" name="bcd" >
<input type="text" placeholder="wetsuit size" name="wetsuit">
<input type="number" placeholder="boots size" name="boots">
<input type="text" placeholder="fins size" name="fins">
<input type="text" placeholder="others" name="others">
</div>
`)
let addNewStudent = () => {
    let newStudentParent = document.getElementById('new-student-list');
    let newStudent = document.createElement('div');
    newStudent.classList.add('card', 'card-info');
    newStudent.innerHTML = newStudentTemplate();
    newStudentParent.appendChild(newStudent);
}
let setupStudentModal = () => {
    var addStudentModal = document.getElementById('addStudentModal');
    addStudentModal.addEventListener('show.bs.modal', function (e) {
        var button = e.relatedTarget
        var orderId = button.getAttribute('data-bs-orderId');
        var orderInput = addStudentModal.querySelector('#hidden-orderId-input');
        orderInput.value = orderId;
        var classCourseInput = addStudentModal.querySelector('#hidden-class-course-id-input');
        var marker = document.getElementsByClassName('marker');
        var classCourseId = marker[0].id;
        classCourseInput.value = classCourseId;
    })
}
let getStudent = async () => {
    let orderList = document.querySelectorAll('div[data-order-id]');
    let orderIdList = [];
    let getStudentPromises = [];
    for (let i = 0; i < orderList.length; i++) {
        let orderId = orderList[i].getAttribute('data-order-id')
        orderIdList.push(orderId);

        //console.log(orderId);
        getStudentPromises.push(axios.get(`/admin/api/course/order/${orderId}`));

    }
    let resultStudent = await Promise.all(getStudentPromises);
    //console.log('getStudentPromises',resultStudent);
    for (let i = 0; i < resultStudent.length; i++) {
        let orderCard = document.querySelector(`div[data-order-id="${orderIdList[i]}"]`)
        //console.log(orderCard);
        let studentParent = orderCard.querySelector('#student-marker');
        studentParent.innerHTML = studentTemplate({ student: resultStudent[i].data });

    }
    //console.log(orderList);
}

let setupClassList = () => {
    let classCard = document.querySelectorAll('div[data-Class-id]');
    //console.log('setupClassList',classCard);
    let classId = [];
    let instructors = [];
    let classParent = document.getElementById('class-picker');
    for (let i = 0; i < classCard.length; i++) {
        let cardTitle = classCard[i].querySelector('.card-title');
        let instructor = cardTitle.textContent.slice(12);
        let newOption = document.createElement('option');
        newOption.value = classCard[i].getAttribute('data-Class-id');
        newOption.text = cardTitle.textContent.slice(12);
        classParent.appendChild(newOption);
    }

}

let checkAvaliability = (url) => {
    return async (e) => {
        // console.log('e.target', e.target);
        // console.log('e.currentTarget', e.currentTarget);
        // console.log('param', url);
        let item_id = document.getElementById('item-picker').value;
        let booking_date = document.getElementById('date-picker').value;
        let booking_session = document.getElementById('session-picker').value;
        let people = document.getElementById('number-input').value;
        let bookBtn = document.getElementById('book-item-btn');
        console.log('check availability btn', item_id, booking_date, booking_session, people, url);
        let result = await axios.post(url, {
            item_id, booking_date, booking_session, people
        })
        console.log(result.data);
        if (result.data) {
            bookBtn.classList.remove('disabled');
            //console.log(Swal);
            let Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,

            })
            Toast.fire({
                icon: 'success',
                title: 'booking avaliable'
            })
        } else {
            let Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,

            })
            Toast.fire({
                icon: 'error',
                title: 'booking unavaliable pls choose another time'
            })
        }
    }



}
let setupClassroomBooking = () => {
    let marker = document.getElementsByClassName('marker');
    console.log(marker[0].id)
    let classCourseId = marker[0].id;
    let hiddenInput = document.getElementById('book-classroom-hidden');
    hiddenInput.value = classCourseId;
}
let bookingListTemplate = Handlebars.compile(`
    <td>{{instructor}}</td>
    <td>{{item}}</td>
    <td>{{booking_date}}</td>
    <td>{{booking_session}}</td>
    <td>{{num_people}}</td>
`)
let setupClassroomList = async () => {
    let marker = document.getElementsByClassName('marker');
    let classCourseId = marker[0].id;
    let classroomTable = document.getElementById('classroom-list-table');
    let result = await axios.get(`/admin/api/classroom/course/${classCourseId}`);
    console.log(result);
    for (let i = 0; i < result.data.length; i++) {
        let date = new Date(result.data[i].booking_date);
        date.setDate(date.getDate() + 1);
        result.data[i].booking_date = date.toISOString().slice(0, 10)
        let tr = document.createElement('tr');
        tr.innerHTML = bookingListTemplate(result.data[i]);
        classroomTable.appendChild(tr);
    }
}
let setupPoolList = async()=>{
    console.log('i am called')
    let marker = document.getElementsByClassName('marker');
    let classCourseId = marker[0].id;
    let poolTable = document.getElementById('pool-list-table');
    console.log('classCourseId',classCourseId);
    let result = await axios.get(`/admin/api/pool/course/${classCourseId}`);
    console.log('setupPoolList',result);
    for(let i=0;i<result.data.length;i++){
        let date = new Date(result.data[i].booking_date);
        date.setDate(date.getDate()+1);
        result.data[i].booking_date = date.toISOString().slice(0,10);
        let tr = document.createElement('tr');
        tr.innerHTML = bookingListTemplate(result.data[i]);
        poolTable.appendChild(tr);
    }
}
let bookingTypeTemplate = Handlebars.compile(`
<label for="item-picker" class="col-form-label">{{type}}:</label>
<select name="bookingItem_id" id="item-picker">
    <option value="" disabled selected>Choose your option</option>

</select>
`)
let setupModal = async (event) => {
    event.stopPropagation();

    let button = event.relatedTarget;
    let type = button.getAttribute('data-bs-type');
    console.log('booking type', type);
    console.log('should be modal', event.target);
    let typeParent = event.target.querySelector('#booking-type-confirm');
    let formParent = event.target.querySelector('#book-item-form')
    if (type == 'classroom') {
        typeParent.innerHTML = bookingTypeTemplate({ type: 'classroom' });
        let optionParent = typeParent.querySelector('#item-picker');
        await setupClassroom(optionParent,'/admin/api/classroom');
        let checkAvaliabilityBtn = document.getElementById('check-availability-btn');
        let newCheckAvaliabilityBtn = checkAvaliabilityBtn.cloneNode(true);
        checkAvaliabilityBtn.parentNode.replaceChild(newCheckAvaliabilityBtn,checkAvaliabilityBtn)
        let url = '/admin/api/classroom/scheduleCheck';
        newCheckAvaliabilityBtn.addEventListener('click', checkAvaliability(url));
        formParent.setAttribute('action','/admin/api/classroom/schedule');
    }else if(type=='pool'){
        typeParent.innerHTML = bookingTypeTemplate({type:'pool'});
        let optionParent = typeParent.querySelector("#item-picker");
        //console.log('inside pool',optionParent);
        await setupPool(optionParent,'/admin/api/pool');
        
        let checkAvaliabilityBtn = document.getElementById('check-availability-btn');
        let newCheckAvaliabilityBtn = checkAvaliabilityBtn.cloneNode(true);
        checkAvaliabilityBtn.parentNode.replaceChild(newCheckAvaliabilityBtn,checkAvaliabilityBtn)
        let url = '/admin/api/pool/scheduleCheck';
        newCheckAvaliabilityBtn.addEventListener('click', checkAvaliability(url));
        formParent.setAttribute('action','/admin/api/pool/schedule');
    }

}
let setupPool = async (optionParent,url)=>{
    let getPool = await axios.get(url);
    //console.log(getPool.data);
    let poolParent = optionParent;
    //console.log('pool setup',poolParent);
    for(let i=0;i<getPool.data.length;i++){
        let newOption = document.createElement('option');
        newOption.value = getPool.data[i].id;
        newOption.text = getPool.data[i].name;
        poolParent.appendChild(newOption);
    }
}
let setupClassroom = async (optionParent,url) => {
    let getClassroom = await axios.get(url);
    //console.log(getClassroom);
    let classroomParent = optionParent
    //console.log(classroomParent);
    for (let i = 0; i < getClassroom.data.length; i++) {
        let newOption = document.createElement('option');
        newOption.value = getClassroom.data[i].id;
        newOption.text = getClassroom.data[i].name;
        classroomParent.appendChild(newOption);
    }
}