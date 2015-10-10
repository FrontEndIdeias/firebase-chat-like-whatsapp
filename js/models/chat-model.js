function Room (professional_id, professional_name, professional_tip, patient_id, patient_name, patient_tip, last_seed, chat_block) {
    this.professional_id = professional_id;
    this.professional_name = professional_name;
    this.professional_tip = professional_tip;
    this.patient_id = patient_id;
    this.patient_name = patient_name;
    this.patient_tip = patient_tip;
    this.last_seed = last_seed;
    this.chat_block = chat_block;
};

function Message (media, text, amazon_uri, sender_id, reciver_id, send_date) {
  this.media = media;
  this.text = text;
  this.amazon_uri = amazon_uri;
  this.sender_id = sender_id;
  this.reciver_id = reciver_id;
  this.send_date = send_date;
};
