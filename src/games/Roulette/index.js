if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import Core from '../Core';
import { Loading, AddressModal, NoticeModal, validate, Message, Modal, htmlFactory } from '@byhealth/walle';
const { inlineStyle } = htmlFactory;

import { renderGame } from './template';
import s from './game.scss';


class Game {
	constructor(config){
		const { style, prizes } = config;
		this.game = new Core({...config, lotteryForms: {
			template: this.template(style.GameTheme, prizes),
			launcher: `.${s.lotterybutton}`,
			action: this.lottery
		}});
		this.Loading = this.game.Loading;
	}

	template = renderGame

	lottery = () => new Promise((resolve) => {
		resolve();
	})
}

module.exports = {Game, NoticeModal, Loading, validate, Message, Modal, AddressModal, inlineStyle};