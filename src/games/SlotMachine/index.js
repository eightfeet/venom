if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import Core from '../Core';
import { Loading, AddressModal, NoticeModal, validate, Message, Modal, htmlFactory, tools } from '@byhealth/walle';
import s from './game.scss';
import createCss from './createCss';

const { dormancyFor } = tools;
const { createDom, inlineStyle } = htmlFactory;

import { renderGame } from './template';
import { setTimeout } from 'timers';

const stamp = (new Date()).getTime();

let gameTimer = null;

class Game {
	constructor(config) {
		const { style, prizes, targetId, parentId, emBase } = config;
		this.targetId = targetId || `game-target-${stamp}${window.Math.floor(window.Math.random() * 100)}`;
		this.emBase = emBase;
		this.prizes = prizes;
		this.GameTheme = style.GameTheme;
		this.parentId = parentId;
		this.core = new Core({
			...config,
			lottery: this.lottery,
			targetId: this.targetId
		});
		this.Loading = this.core.Loading;
		this.oldDge = 0;
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
				this.prizes,
				this.targetId
			),
			this.targetId,
			this.parentId,
			this.emBase
		)
			.then(() => {
				const target = document.getElementById(this.targetId);
				target.classList.add(s.target);
				const boxHeight = target.querySelector(`.slotboard-${this.targetId}`).offsetHeight;
				createCss(boxHeight, this.prizes, this.targetId);
				return dormancyFor(50);
			})
			.then(() => {
				const target = document.getElementById(this.targetId);
				const showprizebtn = target.querySelector(`.${s.toggleprize}`);
				const prizeswrap = target.querySelector(`.${s.prizeswrap}`);
				const startbtn = target.querySelector(`.${s.startbtn}`);

				let showPrize = false;
				const toggle = () => {
					if (showPrize) {
						prizeswrap.classList.remove(s.showprizes);
						showprizebtn.style.display = 'block';
						showPrize = false;
					} else {
						prizeswrap.classList.add(s.showprizes);
						showprizebtn.style.display = 'none';
						showPrize = true;
					}
				};
				showprizebtn.onclick = () => {
					toggle();
				};
				prizeswrap.onclick = () => {
					toggle();
				};
				startbtn.onclick = e => {
					e.preventDefault();
					return this.core.lottery();
				};
			});
	}

	distory = () => {
		const head = document.getElementsByTagName('head')[0];
		head.removeChild(document.getElementById(`slotmachine${this.targetId}`));
		window.clearTimeout(gameTimer);
		this.core.distory();
	}

	stopMachine = (prizePosition) => {
		const target = document.getElementById(this.targetId);
		const outwrap = target.querySelector(`.outwrap-${this.targetId}`);
		const slotwrap = target.querySelector(`.slotwrap-${this.targetId}`);
		setTimeout(() => {
			outwrap.classList.remove(`outslotwrap-${this.targetId}`);
			slotwrap.classList.add(`wrapspin-${this.targetId}-${prizePosition}`);
		}, 800);
	}

	startMachine = () => {
		const target = document.getElementById(this.targetId);
		const outwrap = target.querySelector(`.outwrap-${this.targetId}`);
		const slotwrap = target.querySelector(`.slotwrap-${this.targetId}`);
		slotwrap.classList.add(`comeback-${this.targetId}`);
		Promise.resolve()
			.then(() => dormancyFor(800))
			.then(() => {
				slotwrap.className = `slotwrap-${this.targetId}`;
				outwrap.classList.add(`outslotwrap-${this.targetId}`);
			});
	}


	start = (prizePosition) => new Promise(resolve => {
		this.startMachine();
		window.clearTimeout(gameTimer);
		gameTimer = setTimeout(() => {
			this.stopMachine(prizePosition);
			resolve();
		}, 5000);
	})


	/**
	 *
	 * 开始抽奖
	 * @param {Object} prize 所获奖品
	 * @param {Number} time 旋转时间默认5秒
	 * @param {Number} round 旋转圈数默认6圈
	 * @returns
	 * @memberof Game
	 */
	lottery = (prize) => new Promise((resolve) => {
		let prizeIndex = null;
		// 确认中奖位置
		for (let index = 0; index < this.prizes.length; index++) {
			const element = this.prizes[index];
			if (element.prizeId === prize.prizeId) {
				prizeIndex = index + 1;
			}
		}

		if (prize && !prizeIndex) {
			resolve(prize);
			console.log('所中奖品非展示奖池内奖品', prize);
			console.error('所中奖品非展示奖池内奖品');
			return;
		}

		if (prizeIndex !== null) {
			Promise.resolve()
				.then(() =>this.start(prizeIndex))
				.then(() =>dormancyFor(800))
				.then(() => resolve(prize));
		}
	});

}

module.exports = { Game, NoticeModal, Loading, validate, Message, Modal, AddressModal, inlineStyle };