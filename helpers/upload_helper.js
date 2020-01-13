const path = require('path');

module.exports = {
	uploadDir : path.join(__dirname,'../public/uploads/'),
	isEmpty: function (object) {
		for(let key in object){
			if (object.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	}
};