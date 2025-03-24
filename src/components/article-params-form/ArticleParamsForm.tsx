import styles from './ArticleParamsForm.module.scss';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { RadioGroup } from 'src/ui/radio-group';
import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	OptionType,
} from 'src/constants/articleProps';
import { Text } from 'src/ui/text';
import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';
import clsx from 'clsx';

type ArticleParamsFormProps = {
	articleState: ArticleStateType;
	onApply: (state: ArticleStateType) => void;
	onReset: () => void;
};

export const ArticleParamsForm = ({
	articleState,
	onApply,
	onReset,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const [fontFamily, setFontFamily] = useState<OptionType>(
		articleState.fontFamilyOption
	);
	const [fontSize, setFontSize] = useState<OptionType>(
		articleState.fontSizeOption
	);
	const [fontColor, setFontColor] = useState<OptionType>(
		articleState.fontColor
	);
	const [bgColor, setBgColor] = useState<OptionType>(
		articleState.backgroundColor
	);
	const [containerWidth, setContainerWidth] = useState<OptionType>(
		articleState.contentWidth
	);

	useEffect(() => {
		if (!isOpen) return;

		if (isOpen) {
			document.addEventListener('keydown', handleCloseOnEscape);
		}

		function handleCloseOnEscape(evt: KeyboardEvent) {
			evt.key === 'Escape' && togglePanel();
		}

		return () => {
			document.removeEventListener('keydown', handleCloseOnEscape);
		};
	});

	useOutsideClickClose({
		isOpen,
		rootRef,
		onClose: togglePanel,
		onChange: setIsOpen,
	});

	function submit() {
		onApply({
			fontFamilyOption: fontFamily,
			fontColor: fontColor,
			backgroundColor: bgColor,
			contentWidth: containerWidth,
			fontSizeOption: fontSize,
		});
	}

	function clear() {
		onReset();
		setFontFamily(articleState.fontFamilyOption);
		setFontSize(articleState.fontSizeOption);
		setFontColor(articleState.fontColor);
		setBgColor(articleState.backgroundColor);
		setContainerWidth(articleState.contentWidth);
	}

	function togglePanel() {
		setIsOpen((prevState) => !prevState);
	}

	function handleFormAction(e: SyntheticEvent) {
		e.preventDefault();
		e.type === 'submit' ? submit() : clear();
	}

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={togglePanel} />
			<aside
				className={clsx(styles.container, { [styles.container_open]: isOpen })}
				ref={rootRef}>
				<form
					className={clsx(styles.form)}
					onSubmit={handleFormAction}
					onReset={handleFormAction}>
					<Text as='h2' size={31} weight={800} uppercase dynamicLite>
						Задайте параметры
					</Text>
					<Select
						selected={fontFamily}
						options={fontFamilyOptions}
						onChange={setFontFamily}
						title={'Шрифт'}
					/>
					<RadioGroup
						name={fontSize.className}
						options={fontSizeOptions}
						selected={fontSize}
						title={'Размер шрифта'}
						onChange={setFontSize}
					/>
					<Select
						selected={fontColor}
						options={fontColors}
						onChange={setFontColor}
						title={'Цвет шрифта'}
					/>
					<Separator />
					<Select
						selected={bgColor}
						options={backgroundColors}
						onChange={setBgColor}
						title={'Цвет фона'}
					/>
					<Select
						selected={containerWidth}
						options={contentWidthArr}
						onChange={setContainerWidth}
						title={'Ширина контента'}
					/>
					<div className={clsx(styles.bottomContainer)}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
