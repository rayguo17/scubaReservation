
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return Promise.all([knex('class_course').del(),knex('instructors').del(),knex('course').del(),knex('classroom').del()])
    .then(function () {
      // Inserts seed entries
      return knex('instructors').insert([
        {id: 1, username: 'Dave', level:'admin',full_name:'Dave Chueng'},
        {id: 2, username: 'Tim',level:'admin', full_name:'Tim Cook'},
        {id: 3, username: 'Tom',level:'admin', full_name:'Tom smith'}
      ]);
    }).then(()=>{
      return knex('course').insert([
        {id:1, course_name:'PADI Discover Snorkeling',category:'junior'},
        {id:2, course_name:'PADI Discover Scuba Diving',category:'junior'},
        {id:3, course_name:'PADI Junior Open Water Diver Course',category:'diver'},
        {id:4, course_name:'PADI Rescue Diver Training Course',category:'diver'},
        {id:5, course_name:'Search And Recovery Specialty',category:'specialty'},
        {id:6, course_name:'PADI Digital Underwater Photographer',category:'specialty'},
        
      ]).then(()=>{
        return knex('classroom').insert([
          {id:1,capacity:30,name:'hanseng'},
          {id:2,capacity:20,name:'cocoon'}
        ])
      })
    }).then(()=>{
      return knex('class_course').insert([
            {id:1,start_date:new Date(Date.now()),course_id:1},
            {id:2,start_date:new Date(Date.now()+1000*60*60*24*5),course_id:3},
            {id:3,start_date:new Date(Date.now()+1000*60*60*24*10),course_id:5},
            {id:4,start_date:new Date(Date.now()+1000*60*60*24*15),course_id:3},
            {id:5,start_date:new Date(Date.now()+1000*60*60*24*20),course_id:5}
          ])
    }).then(()=>{
      return knex("pool").insert([
        {id:1,capacity:30,name:'Pok Fu Lam Standford Pool'},
          {id:2,capacity:20,name:'Morse Park Swimming Pool'}
      ])
    })
    .then(()=>{
      // return knex('course_schedule').insert([
      //   {id:1,class_course_id:1,instructor_id:1},
      //   {id:2,class_course_id:1,instructor_id:2},
        
      // ])
    }).then(()=>{
      // return knex('classroom_schedule').insert([
      //   {id:1,booking_date:new Date('2021-06-10'),booking_session:1,people:5,classroom_id:1,schedule_id:1},
      //   {id:2,booking_date:new Date('2021-06-10'),booking_session:1,people:5,classroom_id:1,schedule_id:1},
      //   {id:3,booking_date:new Date('2021-06-10'),booking_session:1,people:5,classroom_id:1,schedule_id:1},
      // ])
    });
};
// .then(()=>{
//   return knex('class_course').insert([
//     {id:1,start_date:new Date(Date.now()),course_id:1},
//     {id:2,start_date:new Date(Date.now()+1000*60*60*24*5),course_id:3},
//     {id:3,start_date:new Date(Date.now()+1000*60*60*24*10),course_id:5},
//     {id:4,start_date:new Date(Date.now()+1000*60*60*24*15),course_id:3},
//     {id:5,start_date:new Date(Date.now()+1000*60*60*24*20),course_id:5}
//   ])
// })
// .then(()=>{
//   return knex('classroom_schedule').insert([
//     {id:1,booking_date:new Date(Date.now()),booking_session:1,people:5,classroom_id:1,schedule_id:1},
//     {id:2,booking_date:new Date(Date.now()),booking_session:1,people:5,classroom_id:1,schedule_id:1},
//     {id:3,booking_date:new Date(Date.now()+1000*60*60*24*5),booking_session:1,people:5,classroom_id:1,schedule_id:2},
//     {id:4,booking_date:new Date(Date.now()+1000*60*60*24*10),booking_session:1,people:5,classroom_id:1,schedule_id:3},
//     {id:5,booking_date:new Date(Date.now()+1000*60*60*24*15),booking_session:1,people:5,classroom_id:1,schedule_id:4},
//     {id:6,booking_date:new Date(Date.now()+1000*60*60*24*20),booking_session:1,people:5,classroom_id:1,schedule_id:5},
//   ])
// })