import s from './game.scss';
import { htmlFactory } from '@byhealth/walle';
const { inlineStyle } = htmlFactory;


/**
 *
 * 创建修饰层
 * @param {Array} modify
 * @returns
 */
function renderModify(modify){

	if (!modify || !Array.isArray(modify)) {
		return '';
	}

	let modifyDom = '';
	for (let index = 0; index < modify.length; index++) {
		const element = modify[index];
		modifyDom += `<div class="${s.modify}" style="${inlineStyle(element)}">&nbsp;</div>`;
	}

	return modifyDom;
}

function renderGameInfo(style, prizes) {
	const { gameImg, prizeAlias, prizeItem, prizeTag } = style;

	const prizeItemStyle = inlineStyle(prizeItem);
	const gameImgStyle = inlineStyle(gameImg);
	const prizeAliasStyle = inlineStyle(prizeAlias);
	const prizeTagStyle = inlineStyle(prizeTag);

	let dom = '';

	for (let index = 0; index < prizes.length; index++) {
		const element = prizes[index];
		dom += `<div class="${s.infoItem}">
			<div class="${s.prizeItem}"  ${prizeItemStyle ? `style="${prizeItemStyle}"` : ''}>
				<div class="${s.prizeTag} ${s.diceicon} ${s[`icon-dice-${index + 1}`]}" ${prizeTagStyle ? `style="${prizeTagStyle}"` : ''}></div>
				<img ${gameImgStyle ? `style="${gameImgStyle}"` : ''} src="${element.prizeImg}" />
				<div ${prizeAliasStyle ? `style="${prizeAliasStyle}"` : ''}>${element.prizeAlias}</div>
			</div>
		</div>`;
	}

	return `<div class="${s.gameinfo}">${dom}</div>`;
}

/**
 *
 * 创建游戏主体
 * @export
 * @param { Object } style 卡牌皮肤
 * @param { Array } prizes 奖项
 * @returns
 */
export function renderGame(style, prizes) {
	const { wrap, modify, dice, side, dot, showPrizeButton, prizesWrap } = style;

	const wrapStyle = inlineStyle(wrap);
	const diceStyle = inlineStyle(dice);
	const sideStyle = inlineStyle(side);
	const dotStyle = inlineStyle(dot);
	const showPrizeButtonStyle = inlineStyle(showPrizeButton);
	const prizesWrapStyle = inlineStyle(prizesWrap);

	// const setSize = {
	// 	transform: `scale(${((dice && dice.size) ? dice.size : '1')},${((dice && dice.size) ? dice.size : '1')})`
	// };

	let dom = `
	<div class="${s.ui_dado}">
		<div class="${s.platform}">
			<div class="${s.dice}" style="${diceStyle}">
				<div style="${sideStyle}" class="${s.side} ${s.front}">
					<div style="${dotStyle}" class="${s.dot} ${s.center}"></div>
				</div>
				<div style="${sideStyle}" class="${s.side} ${s.front} ${s.inner}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.top}">
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dright}"></div>
				</div>
				<div style="${sideStyle}" class="${s.side} ${s.top} ${s.inner}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.right}">
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.center}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dright}"></div>
				</div>
				<div style="${sideStyle}" class="${s.side} ${s.right} ${s.inner}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.left}">
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dright}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dright}"></div>
				</div>
				<div style="${sideStyle}" class="${s.side} ${s.left} ${s.inner}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.bottom}">
					<div style="${dotStyle}" class="${s.dot} ${s.center}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dright}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dright}"></div>
				</div>
				<div style="${sideStyle}" class="${s.side} ${s.bottom} ${s.inner}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.back}">
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dright}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dright}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.center} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.center} ${s.dright}"></div>
				</div>
				<div style="${sideStyle}" class="${s.side} ${s.back} ${s.inner}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.cover} ${s.x}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.cover} ${s.y}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.cover} ${s.z}"></div>
			</div>
		</div>
	</div>
	`;

	return `${modify.length > 0 ? `<div class="${s.modifywrap}">${renderModify(modify)}</div>` : ''} 
	<div class="${s.wrap}" ${wrapStyle ? `style="${wrapStyle}"` : ''}>
	<div class="${s.toggleprize} ${s.toggleb}" ${showPrizeButtonStyle ? `style="${showPrizeButtonStyle}"` : ''}>
		奖品
	</div>
	<div class="${s.prizeswrap}" ${prizesWrapStyle ? `style="${prizesWrapStyle}"` : ''}>${renderGameInfo(style, prizes)}</div>
	<div class="${s.lottery}">
		${dom}
	</div> 
	</div>`;
}
