const groups = [
    ['败家仔の奎顺', '败家仔の延扶', '败家仔の甫见', '败家仔の念朋', '败家仔の初养'],
]

export function getLeader(name) {
    let leader = ''
    for (const i in groups) {
        if (groups[i].indexOf(name) == -1) {
            continue
        }
        leader = groups[i][4]
    }
    return leader
}

export default groups
