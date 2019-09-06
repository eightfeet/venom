if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import Core from '../Core';
import { Loading, AddressModal, NoticeModal, validate, Message, Modal, htmlFactory, tools, webAnimation } from '@byhealth/walle';
import s from './game.scss';
const { dormancyFor } = tools;
const { createDom, inlineStyle } = htmlFactory;
const { onceTransitionEnd } = webAnimation;
console.log('?---', onceTransitionEnd);

import { renderGame } from './template';

const stamp = (new Date()).getTime();

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

		this.target = null;
		this.itemHeight = null;
		this.wrapHeight = null;
		this.prizesRepeats = 6; // 每组奖品重复的次数
		this.repeats = 1;
		this.gamePrizes = [];

		this.renderGame();
	}
    
	/**
	 *
	 * 初始化红包
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
				this.target = document.getElementById(this.targetId);
				// targer 自身的样式无法通过配置控制
				this.target.classList.add(s.target);
				return dormancyFor(50);
			})
			.then(() => {
				const startbtn = this.target.querySelector(`.${s.startbutton}`);
				const topcontent = this.target.querySelector(`.${s.topcontent}`);
				const redpack = this.target.querySelector(`.${s.redpack}`);
				startbtn.onclick = () => {
				    console.log('红包抽奖');
					startbtn.classList.add(s.rotate);
					Promise.resolve()
						.then(() => dormancyFor(1500))
						.then(() => {
							startbtn.style.display = 'none';
							redpack.classList.add(s.redpackopen);
							topcontent.classList.add(s.topcontentopen);
						});
				};
			});
	}
}

module.exports = {Game, NoticeModal, Loading, validate, Message, Modal, AddressModal, inlineStyle};

