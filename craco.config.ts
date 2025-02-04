import path from "path"

const StyleLintPlugin = require("stylelint-webpack-plugin")

module.exports = {
	webpack: {
		plugins: {
			add: [
				new StyleLintPlugin({
					configBasedir: __dirname,
					context: path.resolve(__dirname, "src"),
					files: ["**/*.css"],
				}),
			],
		},
	},
	eslint: {
		mode: "file",
	},
}
