import db from '../model/index'
import common from '../common/index'
import notice from './notice';
class Order {
    async add(req): Promise<Object> {
        let body = req.payload;
        let id = 'order_id_' + common.uuid(23);
        let user_id = body.user_id;
        let amount = body.amount;
        let desc = body.desc;
        let ctime = new Date()
        let params = {
            id,
            user_id,
            amount,
            desc,
            ctime
        }
        console.log(params)
        let createRs = await db.order.create(params);
        if (createRs) {
            notice.index(params)
            return {
                code: 1,
                data: createRs,
                msg: '添加成功'
            }
        } else {
            return {
                code: 0,
                data: [],
                msg: '添加失败'
            }
        }
    }
    async list(req) {
        var pageSize = parseInt(req.params.pageSize) || 1;
        var pageNum = parseInt(req.params.pageNum) || 10;
        console.log(req.params)
        let rs = await db.order.findAll({
            attributes: ['id', 'desc', 'amount', 'user_id', 'ctime'],
            order: [
                // [sequelize.fn('date', sequelize.col('time')), 'desc'],
                ['ctime', 'desc']
            ],
            limit: pageSize,
            offset: (pageNum - 1) * pageSize
        })
        console.log(rs)
        return {
            code: 1,
            data: rs,
            msg: '查询成功'
        }
    }
    async getMouthTotal(req) {
        let res = await db.order.findAll({
            attributes: [
                'amount',
                [db.sequelize.fn('date_format', db.sequelize.col('ctime'), '%Y-%m-%d'), 'date']
            ],
            where: db.sequelize.where(db.sequelize.fn('date_format', db.sequelize.col('ctime'), '%Y-%m'), '2020-04')
        })
        return res
    }
}
let order = new Order()
export default order;