
import classNames from 'classnames'
import React from 'react'

interface Props {
    className?: string
}

const ChevronDown = ({className}: Props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={ className ? className : "h-8 w-8" }>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    )
}

export default ChevronDown