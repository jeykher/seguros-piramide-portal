import React from 'react'
import sectionTemplateStyle from '../Layout/sectionTemplateStyle'

export default function SectionTemplate() {
    return (
        <div className={classNames(classes.main, classes.mainRaised)}>
            <div className={classes.container}>
                {props.children}
            </div>
        </div>
    )
}
