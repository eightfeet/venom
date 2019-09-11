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


/**
 *
 * 创建游戏主体
 * @export
 * @param { Object } style 卡牌皮肤
 * @returns
 */
export function renderGame(style, id) {
	const { wrap, modify, startButton } = style;
	const wrapStyle = inlineStyle(wrap);
	const startButtonStyle = inlineStyle(startButton);

	return `${modify.length > 0 ? `<div class="${s.modifywrap}">${renderModify(modify)}</div>` : ''} 
	<div class="${s.wrap}" ${wrapStyle ? `style="${wrapStyle}"` : ''}>
        <div class="${s.redpack}">
			<div class="${s.topcontent}">
				<div class="${s.info}">
					<div class="${s.subtitle}">开启您的红包</div>
					<div class="${s.title}">恭喜发财，大吉大利</div>
				</div>
				<div class="${s.result} ${s.hide}">
					<div class="${s.gameprizename}">
					</div>
					<div class="${s.gameawardmsg}">
					</div>
				</div>
                <div class="${s.actionbox}">
                    <div class="${s.startbutton}" ${startButtonStyle ? `style="${startButtonStyle}"` : ''}>开始</div>
				</div>
			</div>
			<div class="${s.gameprize} ${s.hide}">
			</div>
			<div class="${s.memo} ${s.hide}">
			</div>
			<div class="${s.ensure} ${s.hide}" id="${id}-ensure">
			</div>
			<div class="${s.reset} ${s.hide}" id="${id}-reset">
			</div>
        </div>   
	</div>`;
}