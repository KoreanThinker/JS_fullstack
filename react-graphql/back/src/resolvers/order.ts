import { intArg, ObjectDefinitionBlock, stringArg } from "@nexus/schema/dist/core"
import { EROFS } from "constants"
import getPartnerId from "../utils/getPartnerId"

//Query
export const order = (t: ObjectDefinitionBlock<"Query">) => t.field('order', {
    type: 'Order',
    args: {
        id: intArg({ required: true }),
    },
    nullable: true,
    resolve: (_, { id }, ctx) => {
        return ctx.prisma.order.findOne({
            where: { id: Number(id) }
        })
    }
})

export const newOrder = (t: ObjectDefinitionBlock<"Query">) => t.list.field('newOrder', {
    type: 'Order',
    resolve: (_, { }, ctx) => {
        const partnerId = getPartnerId(ctx)
        return ctx.prisma.order.findMany({
            where: { AND: { partnerId, itemState: 'receiving' } }
        })
    }
})



// Mutation
export const createOrder = (t: ObjectDefinitionBlock<"Mutation">) => t.field('createOrder', {
    type: 'Order',
    args: {
        price: intArg({ required: true }),
        itemId: intArg({ required: true })
    },
    resolve: async (_, { itemId, price }, ctx) => {
        // todo getUser by token
        const userId = 1

        const item = await ctx.prisma.item.findOne({ where: { id: itemId } })
        if (!item) throw new Error('No Item')
        if (item.price !== price) throw new Error('Price Error')
        if (!item.partnerId) throw new Error('No Partner')

        return ctx.prisma.order.create({
            data: {
                price,
                buyer: { connect: { id: userId } },
                partner: { connect: { id: item.partnerId } },
                item: { connect: { id: itemId } }
            }
        })

    }
})

export const userCancelOrder = (t: ObjectDefinitionBlock<"Mutation">) => t.field('userCancelOrder', {
    type: 'Order',
    args: {
        orderId: intArg({ required: true })
    },
    resolve: async (_, { orderId }, ctx) => {
        // todo getUser by token
        const userId = 1

        const order = await ctx.prisma.order.findOne({ where: { id: orderId } })
        if (!order) throw new Error('No Order')
        if (order.buyerId !== userId) throw new Error('No Access')
        if (order.itemState === 'canceled') throw new Error('Already Canceled')
        if (order.itemState === 'confirmation') throw new Error('User Confirmed')
        if (order.itemState !== 'receiving') throw new Error('Order Already Been Started')

        return ctx.prisma.order.update({
            where: { id: orderId },
            data: {
                itemState: 'canceled'
            }
        })

    }
})

export const partnerCancelOrder = (t: ObjectDefinitionBlock<"Mutation">) => t.field('partnerCancelOrder', {
    type: 'Order',
    args: {
        orderId: intArg({ required: true })
    },
    resolve: async (_, { orderId }, ctx) => {
        const partnerId = getPartnerId(ctx)

        const order = await ctx.prisma.order.findOne({ where: { id: orderId } })
        if (!order) throw new Error('No Order')
        if (order.partnerId !== partnerId) throw new Error('No Access')
        if (order.itemState === 'canceled') throw new Error('Already Canceled')

        return ctx.prisma.order.update({
            where: { id: orderId },
            data: {
                itemState: 'canceled'
            }
        })

    }
})

export const receiveOrder = (t: ObjectDefinitionBlock<"Mutation">) => t.field('receiveOrder', {
    type: 'Order',
    args: {
        orderId: intArg({ required: true })
    },
    resolve: async (_, { orderId }, ctx) => {
        const partnerId = getPartnerId(ctx)

        const order = await ctx.prisma.order.findOne({ where: { id: orderId } })
        if (!order) throw new Error('No Order')
        if (order.partnerId !== partnerId) throw new Error('No Access')
        if (order.itemState !== 'receiving') throw new Error('No Access')

        return ctx.prisma.order.update({
            where: { id: orderId },
            data: {
                itemState: 'receiptCompleted'
            }
        })

    }
})

export const deliveryOrder = (t: ObjectDefinitionBlock<"Mutation">) => t.field('deliveryOrder', {
    type: 'Order',
    args: {
        orderId: intArg({ required: true }),
        waybillNumber: stringArg({ required: true })
    },
    resolve: async (_, { orderId, waybillNumber }, ctx) => {
        const partnerId = getPartnerId(ctx)

        const order = await ctx.prisma.order.findOne({ where: { id: orderId } })
        if (!order) throw new Error('No Order')
        if (order.partnerId !== partnerId) throw new Error('No Access')
        if (order.itemState !== 'receiptCompleted') throw new Error('No Access')

        return ctx.prisma.order.update({
            where: { id: orderId },
            data: {
                itemState: 'deliveryProgress',
                waybillNumber
            }
        })

    }
})

// deliveryApiPlz
export const deliveryCompletedOrder = (t: ObjectDefinitionBlock<"Mutation">) => t.field('deliveryCompletedOrder', {
    type: 'Order',
    args: {
        orderId: intArg({ required: true })
    },
    resolve: async (_, { orderId }, ctx) => {
        const partnerId = getPartnerId(ctx)

        const order = await ctx.prisma.order.findOne({ where: { id: orderId } })
        if (!order) throw new Error('No Order')
        if (order.partnerId !== partnerId) throw new Error('No Access')
        if (order.itemState !== 'deliveryProgress') throw new Error('No Access')

        return ctx.prisma.order.update({
            where: { id: orderId },
            data: {
                itemState: 'deliveryCompleted'
            }
        })

    }
})

export const confirmationOrder = (t: ObjectDefinitionBlock<"Mutation">) => t.field('confirmationOrder', {
    type: 'Order',
    args: {
        orderId: intArg({ required: true })
    },
    resolve: async (_, { orderId }, ctx) => {
        // todo getUser by token
        const userId = 1

        const order = await ctx.prisma.order.findOne({ where: { id: orderId } })
        if (!order) throw new Error('No Order')
        if (order.buyerId !== userId) throw new Error('No Access')
        if (order.itemState !== 'deliveryCompleted') throw new Error('No Access')

        return ctx.prisma.order.update({
            where: { id: orderId },
            data: {
                itemState: 'confirmation'
            }
        })

    }
})