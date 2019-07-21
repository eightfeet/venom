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
			template: this.renderGame(style.GameTheme, prizes),
			launcher: `.${s.lotterybutton}`,
			action: this.startLottery
		}});
		this.Loading = this.game.Loading;
		this.oldDge = 0;
	}

	renderGame = renderGame

	/**
	 *
	 * 开始抽奖
	 * @param {Object} prize 所获奖品
	 * @param {Number} time 旋转时间默认5秒
	 * @param {Number} round 旋转圈数默认6圈
	 * @returns
	 * @memberof Game
	 */
	startLottery = (prize, time, round) => {
		const { prizeId } = prize || {};
		const target = document.getElementById(this.game.targetId);
		const wheel = target.querySelector(`.${s.lottery}`);
		const length = this.game.prizes.length;
		const eachDeg = 360 / length;

		return new Promise((resolve, reject) => {
			if (!prizeId) {
				this.lotteryDrawing = false;
				return reject('抽奖失败！');
			}
			const newtime = parseInt(time, 0) || 5;
			
			const defaultRound = round || 6;
			let position = 0;
			const halfDeg = eachDeg / 2;
			this.game.prizes.forEach((el, index) => {
				if (el.prizeId === prizeId) {
					position = length - (index + 1);
				}
			});

			let newdeg = eachDeg * position;
			newdeg += 360*defaultRound; // 默认旋转几周
			newdeg = newdeg + halfDeg;
			newdeg = newdeg + this.oldDge;
			this.oldDge = (newdeg - (newdeg%360))%360;
			const css = `-webkit-transition-duration: ${newtime}s;
						transition-duration: ${newtime}s;
						-webkit-transform: rotate(${newdeg}deg);
						transform: rotate(${newdeg}deg)`;
			wheel.setAttribute('style', css);
			window.clearTimeout(this.roundTimer);
			this.roundTimer = setTimeout(() => {
				const css = `-webkit-transform: rotate(${newdeg%360}deg);
							transform: rotate(${newdeg%360}deg)`;
				wheel.setAttribute('style', css);
				resolve(prize);
				this.lotteryDrawing = false;
			}, newtime * 1000);

		});

	}
}

module.exports = {Game, NoticeModal, Loading, validate, Message, Modal, AddressModal, inlineStyle};