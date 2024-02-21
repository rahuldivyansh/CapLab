import React from 'react'
import Button from '../Button'
import { Italic } from 'lucide-react'
import ControllerButton from './controller-button'
import { ICON_DIMENSIONS } from './constants'

const EditorItalicController = ({ editor }) => {
    return (
        <ControllerButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
                !editor.can()
                    .chain()
                    .focus()
                    .toggleItalic()
                    .run()
            }
            active={editor.isActive('italic')}
        >
            <Italic width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </ControllerButton>
    )
}

export default EditorItalicController