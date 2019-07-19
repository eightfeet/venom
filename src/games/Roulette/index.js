if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import Core from '../Core';
import { Loading, AddressModal, NoticeModal, validate, Message, Modal, htmlFactory } from '@byhealth/walle';
const { inlineStyle } = htmlFactory;

// import { renderGame } from './template';
import s from './game.scss';


class Game {
	constructor(config){
		this.game = new Core({...config, lotteryForms: {
			template: this.template(),
			launcher: `.${s.lotterybutton}`,
			action: this.lottery
		}});
		this.Loading = this.game.Loading;
	}

	template = () => (`<div class="${s.lotterybutton}">测试</div>`)

	lottery = () => new Promise((resolve) => {
		resolve();
	})
}

module.exports = {Game, NoticeModal, Loading, validate, Message, Modal, AddressModal, inlineStyle};