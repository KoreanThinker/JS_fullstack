import { objectType } from "@nexus/schema"

export const User = objectType({
    name: 'User',
    definition(t) {
        t.model.id()
        t.model.name()
        t.model.email()
        // t.model.password()
        t.model.createdAt()
        t.model.orders()
        t.model.sns()
    }
})