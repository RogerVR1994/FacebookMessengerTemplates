'use strict'

var basicTemplate = {
  "attachment":{
    "type":"template",
    "payload":{
      "template_type":"button",
      "text": "",
      "buttons":[
        
      ]
    }
  }
}

let list = {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "list",
      "top_element_style": "compact",
      "elements": [
      ]
    }
  }
}
let element = {
  "title": "",      
  "buttons": [
    {
       "type":"postback",
       "title": "Conoce Más",
       "payload": "info"
     }
  ]        
}

let genericTemplate = {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "generic",
      "elements": [{
        "title": "",
        "subtitle": "",
        "image_url": "",
        "buttons": [{
          "type": "web_url",
          "url": "",
          "title": ""
        }],
      }]
    }
  }
}

let carousel = {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "generic",
      "elements": [
      ]
    }
  }
}

/**
 * cleanAccents() lets you replace all letters with special
 * chars to regular notation
 * @param {String} text - Text that includes special characters.
*/

function cleanAccents(text){
  text = text.replace(/á/gi, "a")
  text = text.replace(/é/gi, "e")
  text = text.replace(/í/gi, "i")
  text = text.replace(/ó/gi, "o")
  text = text.replace(/ú/gi, "u")
  text = text.replace(/ñ/gi, "n")
  return text
}

/**
 * createCarousel() lets you create a product carousel for 
 * Facebook Messenger.
 * @param {Object} content - Carousel elements. It can include
 * buttons, images and text.
 * @return {Object} - Facebook Messenger expected JSON for carousel
 */

function createCarousel(content, count){
  var carouselElement = []
  carousel.attachment.payload.elements = content

  return carousel

}

/**
 * purgeHtml() receives an HTML formatted text, and removes all
 * tags in it. 
 * @param {String} message - HTML formatted text
 * @return {String} - Pure text
 */

function purgeHtml(message) {
  return message.replace(/<(?:.|\n)*?>/gm, '');
}

/**
 * cleanHtml() lets you enter and HTMl text and leave only 
 * special formats like, italics and bold text. All other 
 * tags will be removed
 * @param {String} message - HTML formatted text that includes
 * bold, or italics tag (<b></b>)
 * @return {String} - .md formatted text to be interpreted by 
 * Messenger.
 */

function cleanHtml(message){
  return message.replace(/<br>/g, '\n').replace(/<li>/g, '\n*** ').replace(/\/p/g, '\n').replace(/<strong>|<\/strong>/g, '*').replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp/g, '').replace(/;/g, '').replace(/<p>/g, '');
}

/**
 * createImgUrl() sends an image with a title, subtitle, an buttons
 */

function createImgUrl(content){
  genericTemplate.attachment.payload.elements[0].title = content.title
  genericTemplate.attachment.payload.elements[0].subtitle = content.subtitle
  genericTemplate.attachment.payload.elements[0].image_url = content.image_url
  genericTemplate.attachment.payload.elements[0].buttons[0].url = content.directions
  genericTemplate.attachment.payload.elements[0].buttons[0].title = "¿Cómo llegar?"  
  return genericTemplate
}

function createList(message){
  list.attachment.payload.template_type = 'list';
  let buttons = list.attachment.payload.elements;
  let opciones = message.watsonData.context.opciones;

  for(let i = 0; i<Object.keys(opciones).length; i++){
    let adjust = JSON.parse(JSON.stringify(element));
    adjust.title = opciones[i];
    adjust.buttons[0].payload = opciones[i];
    buttons.push(adjust);
  } 
  return list;
}

function createButtons(message){
	var options = message.watsonData.context.opciones;
	var optionsNum = options.length;
	var timesToMessage = Math.ceil(optionsNum/3);
	var message = message.watsonData.output.text.join('\n')
	
	var response=[]
	var count = 0
	
	for(var i = 0; i< timesToMessage; i++){
		response[i]=JSON.parse(JSON.stringify(basicTemplate))
		for(var j = 0; j<3; j++){
			if(options[j+count]==undefined){
				break
			}
			response[i].attachment.payload.buttons[j]= {
													       "type":"postback",
													       "title": cleanHtml(options[j+count]),
													       "payload": cleanHtml(options[j+count])
													     }	
		}
		count += 3
		response[i].attachment.payload.text = '\f';
	}

	return response							         
		
}

module.exports.createButtons = createButtons;
module.exports.createImgUrl = createImgUrl;
module.exports.cleanHtml = cleanHtml;
module.exports.createCarousel = createCarousel;
module.exports.cleanAccents = cleanAccents;
module.exports.createList = createList;
module.exports.purgeHtml = purgeHtml;