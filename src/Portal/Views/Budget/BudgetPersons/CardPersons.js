import React, { useState, useEffect } from 'react'
import CardPanel from 'components/Core/Card/CardPanel'

export default function CardPersons({ budgetInfo, plan }) {
    const [agesPlan, setAgesPlan] = useState(null)

    useEffect(() => {
        if (plan) {
            const apliAge = budgetInfo.insured.filter((a) => plan.coberturas.findIndex((p) => p.age === a.age) === -1 ? false : true)
            setAgesPlan(apliAge)
        }
    }, [plan])

    return (
        <CardPanel titulo="Edades" icon="group" iconColor="primary" >
            <div>{agesPlan && agesPlan.map((a, index) => (<span>{`${index > 0 ? ', ' : ''}${a.age}`}</span>))}</div>
        </CardPanel>
    )
}
