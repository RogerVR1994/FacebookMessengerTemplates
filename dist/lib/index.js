'use strict';

var basicTemplate = {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "button",
      "text": "",
      "buttons": []
    }
  }
};

var list = {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "list",
      "top_element_style": "compact",
      "elements": []
    }
  }
};
var element = {
  "title": "",
  "buttons": [{
    "type": "postback",
    "title": "Conoce Más",
    "payload": "info"
  }]
};

var genericTemplate = {
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
        }]
      }]
    }
  }
};

var carousel = {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "generic",
      "elements": []
    }
  }
};

function cleanAccents(text) {
  text = text.replace(/á/gi, "a");
  text = text.replace(/é/gi, "e");
  text = text.replace(/í/gi, "i");
  text = text.replace(/ó/gi, "o");
  text = text.replace(/ú/gi, "u");
  text = text.replace(/ñ/gi, "n");
  return text;
}

function createCarousel(content, count) {
  var carouselElement = [];
  carousel.attachment.payload.elements = content;

  return carousel;
}

function cleanHtml(message) {
  return message.replace(/<li>/g, '\n*** ').replace(/\/p/g, '\n').replace(/<strong>|<\/strong>/g, '*').replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp/g, '').replace(/;/g, '').replace(/<p>/g, '');
}

function createImgUrl(content) {
  genericTemplate.attachment.payload.elements[0].title = content.title;
  genericTemplate.attachment.payload.elements[0].subtitle = content.subtitle;
  genericTemplate.attachment.payload.elements[0].image_url = content.image_url;
  genericTemplate.attachment.payload.elements[0].buttons[0].url = content.directions;
  genericTemplate.attachment.payload.elements[0].buttons[0].title = "¿Cómo llegar?";
  return genericTemplate;
}

function createList(message) {
  list.attachment.payload.template_type = 'list';
  var buttons = list.attachment.payload.elements;
  var opciones = message.watsonData.context.opciones;

  for (var i = 0; i < Object.keys(opciones).length; i++) {
    var adjust = JSON.parse(JSON.stringify(element));
    adjust.title = opciones[i];
    adjust.buttons[0].payload = opciones[i];
    buttons.push(adjust);
  }
  return list;
}

function createButtons(message) {
  var options = message.watsonData.context.opciones;
  var optionsNum = options.length;
  var timesToMessage = Math.ceil(optionsNum / 3);
  var message = message.watsonData.output.text.join('\n');

  var response = [];
  var count = 0;

  for (var i = 0; i < timesToMessage; i++) {
    response[i] = JSON.parse(JSON.stringify(basicTemplate));
    for (var j = 0; j < 3; j++) {
      if (options[j + count] == undefined) {
        break;
      }
      response[i].attachment.payload.buttons[j] = {
        "type": "postback",
        "title": cleanHtml(options[j + count]),
        "payload": cleanHtml(options[j + count])
      };
    }
    count += 3;
    response[i].attachment.payload.text = '\f';
  }

  return response;
}

module.exports.createButtons = createButtons;
module.exports.createImgUrl = createImgUrl;
module.exports.cleanHtml = cleanHtml;
module.exports.createCarousel = createCarousel;
module.exports.cleanAccents = cleanAccents;
module.exports.createList = createList;