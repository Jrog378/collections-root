export const fullName = (firstName: string | undefined, lastName: string | undefined, type: string = "Artist") => {
    if (!firstName && !lastName) {
        return `Unknown ${type}`
    } else if (!firstName || !lastName) {
        return `${firstName}${lastName}`
    } else {
        return `${firstName} ${lastName}`
    }
}

export const artistDates = (birth_year: string | undefined, death_year: string | undefined) => {
    if (birth_year && death_year != "" && death_year && death_year !== "") {
        return ` (${birth_year} - ${death_year})`
    } else if (birth_year && birth_year !== "") {
        return ` (b. ${birth_year})`
    } else if (death_year && death_year !== "") {
        return ` (d. ${birth_year})`
    } else return ``
}

export const unknownYear = (year: string | undefined) => {
    if (year && year != "") {
        return `, ${year}`
    } else {
        return `<i>, n.d.</i>`
    }
}

export const sizingAuto = ({ height, width, depth = "", inches }: { height: string | undefined, width: string | undefined, depth: string | undefined, inches: boolean }) => {
    if (height && height != "" && width && width != "" && depth && depth.trim() != "") {
        return `${height} x ${width} x ${depth} ${inches ? 'inches' : 'centimeters'} <br/>`
    }
    if (height && height != "" && width && width != "") {
        return `${height} x ${width} ${inches ? 'inches' : 'centimeters'} <br/>`
    } else {
        return ``
    }
}

export const donorAuto = ({first_name, last_name}: {first_name: string | undefined, last_name: string | undefined}) => {
    if (first_name && first_name != "" && last_name && last_name != "") {
        return `Donated by ${first_name} ${last_name} <br/>`
    } else {
        return ``
    }
}