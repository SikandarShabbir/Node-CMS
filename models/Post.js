const mongoose = require('mongoose');
URLSlugs = require('mongoose-url-slugs');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	category: {
		type: Schema.Types.ObjectId,
		ref: 'categories'
	},
	title: {
		type: String,
		required: true
	},
	status: {
		type: String,
		default: 'public'
	},
	allowComments: {
		type: Boolean,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	file: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now()
	},
	slug: {
		type: String
	}
});
PostSchema.plugin(URLSlugs('title',{field: 'slug'}));
module.exports = mongoose.model('posts', PostSchema);