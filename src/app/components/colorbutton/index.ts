import ColorButtonComponent from "./ColorButton";
import ColorButtonGroup from "./ColorButtonGroup";

const ColorButton = Object.assign(
	ColorButtonComponent,
	{
		// @component ./ColorButtonGroup
		Group: ColorButtonGroup,
	}
);

export default ColorButton;
