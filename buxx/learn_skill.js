export function teach_pet(cga) {
    if (!cga.GetSkillsInfo().find(s => s.name == '调教')) {
        return cga.emogua.goto(n => n.falan.e1).then(
            () => cga.emogua.autoWalkList([
                [219,136,'*'],[27,20,'*'],[10,6,'*'],[11,6]
            ])
        ).then(
            () => cga.emogua.learnPlayerSkill(11,5)
        );
    }
}

export function strong_pet(cga) {
    if (!cga.GetSkillsInfo().find(s => s.name == '宠物强化')) {
        return cga.emogua.goto(n => n.falan.w1).then(
            () => cga.emogua.autoWalkList([
                [122,36,'*'],[14,5]
            ])
        ).then(
            () => cga.emogua.learnPlayerSkill(14,4)
        );
    }
}
