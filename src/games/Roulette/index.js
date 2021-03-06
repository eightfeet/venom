if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import Core from '../Core';
import { Loading, AddressModal, NoticeModal, validate, Message, Modal, htmlFactory, tools } from '@byhealth/walle';
import s from './game.scss';

const { dormancyFor } = tools;
const { createDom, inlineStyle } = htmlFactory;

import { renderGame } from './template';

const stamp = (new Date()).getTime();


class Game {
	constructor(config){
		const { style, prizes, targetId, parentId, emBase } = config;
		this.targetId = targetId || `game-target-${stamp}${window.Math.floor(window.Math.random() * 100)}`;
		this.emBase = emBase;
		this.prizes = prizes;
		this.GameTheme = style.GameTheme;
		this.parentId         = parentId;
		this.core = new Core({...config,
			lottery: this.lottery,
			targetId: this.targetId});
		this.Loading = this.core.Loading;
		this.distory = this.core.distory;
		this.oldDge           = 0;
		this.renderGame();
		this.activeElements = null;
	}

	/**
	 *
	 * 初始化翻牌模板
	 * @memberof Game
	 */
	renderGame = () => {
		return createDom(
			renderGame(
				this.GameTheme,
				this.prizes
			),
			this.targetId,
			this.parentId,
			this.emBase
		)
			.then(() => {
				const target = document.getElementById(this.targetId);
				target.classList.add(s.target);
				return dormancyFor(50);
			})
			.then(() => {
				const target = document.getElementById(this.targetId);
				const lotterybtn = target.querySelector(`.${s.lotterybutton}`);
				lotterybtn.onclick = (e) => {
					e.preventDefault();
					return this.core.lottery();
				};
			});
	}


	/**
	 *
	 * 开始抽奖
	 * @param {Object} prize 所获奖品
	 * @param {Number} time 旋转时间默认5秒
	 * @param {Number} round 旋转圈数默认6圈
	 * @returns
	 * @memberof Game
	 */
	lottery = (prize, time, round) => {
		const { prizeId } = prize || {};
		const target = document.getElementById(this.targetId);
		const wheel = target.querySelector(`.${s.lottery}`);
		const length = this.prizes.length;
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
			this.prizes.forEach((el, index) => {
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