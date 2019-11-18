import HookAfter from '../base/after';

export class ResizeColumn extends HookAfter {
	hook() {
		return 'document/elements/settings';
	}

	id() {
		return 'resize-column';
	}

	conditions( args ) {
		return args.settings._inline_size;
	}

	apply( args ) {
		const { containers = [ args.container ] } = args;

		containers.forEach( ( /**Container*/ container ) => {
			this.resizeColumn( container, args.settings._inline_size );
		} );

		return true;
	}

	resizeColumn( container, newSize ) {
		const nextContainer = container.parent.view.getNeighborContainer( container );

		if ( ! nextContainer ) {
			return false;
		}

		const currentSize = container.oldValues._inline_size || container.settings.get( '_column_size' );

		const nextChildView = nextContainer.view,
			$nextElement = nextChildView.$el,
			nextElementCurrentSize = +nextChildView.model.getSetting( '_inline_size' ) ||
				container.parent.view.getColumnPercentSize( $nextElement, $nextElement[ 0 ].getBoundingClientRect().width ),
			nextElementNewSize = +( currentSize + nextElementCurrentSize - newSize ).toFixed( 3 );

		/**
		 * TODO: Hook prevented ( next command will not call recursive hook ), but we didnt tell the hook to be prevented
		 * consider: '$e.hooks.preventRecursive()'.
		 */
		$e.run( 'document/elements/settings', {
			containers: [ nextContainer ],
			settings: {
				_inline_size: nextElementNewSize,
			},
			options: {
				history: {
					title: elementor.config.elements.column.controls._inline_size.label,
				},
				external: true,
			},
		} );

		return true;
	}
}

export default ResizeColumn;