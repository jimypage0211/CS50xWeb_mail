document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', sendEmail);
  
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //load emails filtered by mailbox content
  fetch(`/emails/${mailbox}`)
    .then(response => {
      console.log(response);
      return response.json()
    })
    .then(emails =>{  
      // Creating divs for switching between the mailbox view and the email view
      const emailsDiv = document.createElement('div')    
      emailsDiv.className = "list-group-item";
      const emailViewDiv = document.createElement('div')
      emailViewDiv.style.display = 'none';
      bodyDiv = document.createElement('div');
      subjectDiv = document.createElement('div');
      emailViewDiv.append(subjectDiv);
      emailViewDiv.append(bodyDiv);
      //fix to be in a single  page
      for (email of emails){
        const hideDiv = function() {
          console.log(email);
          emailsDiv.style.display = 'none';
          emailViewDiv.style.display = 'block';
          fetch(`/emails/${email.id}`)
            .then(response => response.json())
            .then(emaill =>{              
              bodyDiv.innerHTML = emaill.body;              
              subjectDiv.innerHTML = emaill.subject
            })
        }  
        const emailElement = document.createElement('div');
        emailElement.className = "list-group-item";
        emailAddress = "";
        if (mailbox === "sent"){
          emailAddress = `<h5>To: ${email.recipients}</h5>`
        } else {
          emailAddress = `<h5>From: ${email.sender}</h5>`
        }
        emailElement.innerHTML = `
        ${emailAddress}
        <h6>Subject: ${email.subject}</h6>
        <h6>Date: ${email.timestamp}</h6>
        ` 
        emailElement.addEventListener('click', hideDiv );
        emailsDiv.append(emailElement);
      }
      document.querySelector('#emails-view').append(emailsDiv);
      document.querySelector('#emails-view').append(emailViewDiv);
    })
}

function sendEmail(event){
  event.preventDefault();
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: "POST",
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  }).then(response => response.json()).then(json => {
    console.log(json);
  })

  load_mailbox("inbox")
}

