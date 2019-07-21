if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import Core from '../Core';
import { Loading, AddressModal, NoticeModal, validate, Message, Modal, htmlFactory } from '@byhealth/walle';
const { inlineStyle } = htmlFactory;

import { renderGame } from './template';
import s from './game.scss';
import { getGameDataLength, supplementingData } from './helper';

const stamp = (new Date()).getTime();

class Game {
	constructor(config){
		const { style, prizes, targetId } = config;
		this.targetId = targetId || `game-target-${stamp}${window.Math.floor(window.Math.random() * 100)}`;

		this.prizesLength = getGameDataLength(prizes.length);
		this.prizes = supplementingData(prizes, this.prizesLength);

		this.game = new Core({...config, targetId: this.targetId, lotteryForms: {
			template: this.renderGame(
				style.GameTheme,
				this.prizes,
				`${this.targetId}_items`
			),
			launcher: `.${s.lotterybutton}`,
			action: this.lottery
		}});
		this.Loading = this.game.Loading;
		// 历史位置
		this.historyPrizeInd = 0;
		// 缓冲阈值
		this.buffer = 5;
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
	// 渲染遗留数据
	lotteryHistory = (time) => {
		let itemsDomList = document.getElementById(`${this.targetId}_items`).children;
		let surplus = this.historyPrizeInd;
		let settime = time || 100;
		return new Promise(resolve => {
			if (surplus <= 0) {
				return resolve();
			}
			let timer = null;
			const that = this;
			(function run() {
				for (let index = 0; index < that.prizesLength; index++) {
					const element = itemsDomList[index];
					element.classList.remove(s.active);
				}
				itemsDomList[surplus].classList.add(s.active);
				surplus++;
				window.clearTimeout(timer);
				timer = setTimeout(() => {
					if (surplus < that.prizesLength) {
						run();
					} else {
						resolve();
					}
				}, settime + that.buffer * 50);
			})();
		});
	}
	/**
	 *
	 * 开始抽奖
	 * @param {Object} prize 所获奖品
	 * @param {Number} time 每个奖项停留时间
	 * @param {Number} round 旋转圈数默认6圈
	 * @returns
	 * @memberof Game
	 */
	startLottery = (prize, time, round) => {
		const { prizeId } = prize || {};
		return new Promise((resolve, reject) => {
			if (!prizeId) {
				this.lotteryDrawing = false;
				return reject('抽奖失败！');
			}
			let getPrizeInd = 0;
			for (let index = 0; index < this.prizes.length; index++) {
				const element = this.prizes[index];
				if (element.prizeId === prize.prizeId) {
					getPrizeInd = index;
					break;
				}
			}

			let itemsDomList = document.getElementById(`${this.targetId}_items`).children;

			let settime = time || 100;

			let timer = null;
			// 指针位置
			let pointerLocation = 0;
			// 默认几圈
			let defaultCircle = round || 3;
			// 算出路程
			let pathLength = defaultCircle * this.prizesLength + getPrizeInd;
			const that = this;
			(function fun() {
				for (let index = 0; index < itemsDomList.length; index++) {
					const element = itemsDomList[index];
					element.classList.remove(s.active);
				}
				itemsDomList[pointerLocation % that.prizesLength].classList.add(s.active);
				window.clearTimeout(timer);
				timer = setTimeout(() => {
					pointerLocation++;
					if (pointerLocation < 10 && that.buffer !== 0) {
						that.buffer--;
					}
					if (pointerLocation > pathLength - 10) {
						that.buffer++;
					}
					if (pointerLocation <= pathLength) {
						fun();
					} else {
						pointerLocation = 0;
						that.buffer = 0;
						resolve(prize);
						that.historyPrizeInd = getPrizeInd;
						// console.log(`中奖${prize}`, `位置${getPrizeInd}`);
						that.lotteryDrawing = false;
					}
				}, settime + that.buffer * 50);
			})();
		});
	}

	lottery = prize => {
		return Promise.resolve()
			.then(() => this.lotteryHistory())
			.then(() => this.startLottery(prize));
	}
}

module.exports = {Game, NoticeModal, Loading, validate, Message, Modal, AddressModal, inlineStyle};