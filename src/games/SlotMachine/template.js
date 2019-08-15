import s from './game.scss';
import { htmlFactory } from '@byhealth/walle';
const { inlineStyle } = htmlFactory;


/**
 *
 * 创建修饰层
 * @param {Array} modify
 * @returns
 */
function renderModify(modify) {

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
	const { gameInfoImg, prizeAlias, showGameInfoButton, gameInfoWrap, gameInfo, gameInfoItem } = style;

	const showGameInfoButtonStyle = inlineStyle(showGameInfoButton);
	const gameInfoWrapStyle = inlineStyle(gameInfoWrap);
	const gameInfoStyle = inlineStyle(gameInfo);
	const gameInfoImgStyle = inlineStyle(gameInfoImg);
	const prizeAliasStyle = inlineStyle(prizeAlias);
	const gameInfoItemStyle = inlineStyle(gameInfoItem);

	let dom = '';

	for (let index = 0; index < prizes.length; index++) {
		const element = prizes[index];
		dom += `<div class="${s.infoItem}" >
			<div class="${s.prizeItem}"  ${gameInfoItemStyle ? `style="${gameInfoItemStyle}"` : ''}>
				<img ${gameInfoImgStyle ? `style="${gameInfoImgStyle}"` : ''} src="${element.prizeImg}" />
				<div ${prizeAliasStyle ? `style="${prizeAliasStyle}"` : ''}>${element.prizeAlias}</div>
			</div>
		</div>`;
	}

	return `<div class="${s.toggleprize} ${s.toggleb}" ${showGameInfoButtonStyle ? `style="${showGameInfoButtonStyle}"` : ''}>
		奖品
	</div>
	<div class="${s.prizeswrap}" ${gameInfoWrapStyle ? `style="${gameInfoWrapStyle}"` : ''}>
		<div class="${s.gameinfo}" ${gameInfoStyle ? `style="${gameInfoStyle}"` : ''}>${dom}</div>
	</div>`;
}

function renderGamePrize(style, prizes, id) {
	let dom = '';

	for (let index = 0; index < prizes.length; index++) {
		const element = prizes[index];
		dom += `<div class="item-${id}" style="height:${(1 / prizes.length) * 100}%;">
			<span style="position: absolute; top:0">${index + 1}</span>
			<img src="${element.prizeImg}" />
		</div>`;
	}

	return `<div class="slotboard-${id}">
		<div class="outwrap-${id}">
			<div class="slotwrap-${id}">
				${dom}
			</div>
		</div>
	</div>`;
}

/**
 *
 * 创建游戏主体
 * @export
 * @param { Object } style 卡牌皮肤
 * @param { Array } prizes 奖项
 * @returns
 */
export function renderGame(style, prizes, id) {
	const { wrap, modify, startButton } = style;
	const wrapStyle = inlineStyle(wrap);
	const startButtonStyle = inlineStyle(startButton);

	return `${modify.length > 0 ? `<div class="${s.modifywrap}">${renderModify(modify)}</div>` : ''} 
	<div class="${s.wrap}" ${wrapStyle ? `style="${wrapStyle}"` : ''}>
		${renderGameInfo(style, prizes)}
		${renderGamePrize(style, prizes, id)}
	</div>
	<button class="${s.startbtn}" ${startButtonStyle ? `style="${startButtonStyle}"` : ''}>开始游戏</button>`;
}
