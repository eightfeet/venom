const configs = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const scripts = `<script src="https://by-health-cdn.oss-cn-beijing.aliyuncs.com/region/regions.js"></script>
<script src="/data/prizes1.js"></script>
<script src="/data/prizes2.js"></script>
<script src="/data/themedata1.js"></script>
<script src="/data/themedata2.js"></script>`;

// console.log('HtmlWebpackPlugin', HtmlWebpackPlugin);
let HtmlPlugin = [];
let entry = {};

configs.forEach(element => {
	const {name, path, template, filename, templatename} = element;
	const HtmlPluginItem = new HtmlWebpackPlugin({
		title: templatename || name,
		minify: {
			collapseWhitespace: true
		},
		hash : true,
		template,
		filename: filename || `${name}.html`,
		chunks: [name],
		scripts
	});
	entry[name] = path;
	HtmlPlugin.push(HtmlPluginItem);
});

module.exports = {
	HtmlWebpackPlugin: HtmlPlugin,
	entry
};