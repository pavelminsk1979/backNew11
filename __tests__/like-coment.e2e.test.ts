import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {STATUS_CODE} from "../src/common/constant-status-code";
import mongoose from "mongoose";
import * as dotenv from "dotenv";


dotenv.config()

const req = supertest(app)

describe('/like_comments', () => {


    beforeAll(async () => {

        const mongoUri = process.env.MONGO_URL;

        if (!mongoUri) {
            throw new Error('URL not find(file mongoDb/like_comments_test')
        }

        await mongoose.connect(mongoUri
            , {dbName: process.env.DB_NAME});

        await req
            .delete('/testing/all-data')

    })


    afterAll(async () => {
        await mongoose.disconnect()
    });


    const loginPasswordBasic64 = 'YWRtaW46cXdlcnR5'
    const loginNewUser = '300300'
    const passwordNewUser = '11111pasw'
    const emailNewUser = 'palPel@mail.ru'
    let jwtToken1 = ''
    const loginSecondUser = '100100'
    const passwordSecondUser = '55555pasw'
    const emailSecondUser = 'SecondUs@mail.ru'
    let jwtTokenSecond = ''
    let idBlog: string
    let idPost: string
    let idComent: string

    ////////////////////////////////////////////////////////////
    // запустить тест, потом закоментировать
    //создание юзера и блога и поста

    it(' create users', async () => {
        const res = await req
            .post('/users')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                login: loginNewUser,
                password: passwordNewUser,
                email: emailNewUser
            })
            .expect(STATUS_CODE.CREATED_201)

        expect(res.body.login).toEqual(loginNewUser)
        expect(res.body.email).toEqual(emailNewUser)
    })


    it(" login user", async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: loginNewUser,
                password: passwordNewUser
            })
            .expect(STATUS_CODE.SUCCESS_200)

        // console.log(res.body.accessToken)
        jwtToken1 = res.body.accessToken

        expect(res.body.accessToken).toBeTruthy()
    })


    it(' create secondUsers', async () => {
        const res = await req
            .post('/users')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                login: loginSecondUser,
                password: passwordSecondUser,
                email: emailSecondUser
            })
            .expect(STATUS_CODE.CREATED_201)

        expect(res.body.login).toEqual(loginSecondUser)
    })


    it(" login secondUsers", async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: loginSecondUser,
                password: passwordSecondUser
            })
            .expect(STATUS_CODE.SUCCESS_200)

        // console.log(res.body.accessToken)
        jwtTokenSecond = res.body.accessToken

        expect(res.body.accessToken).toBeTruthy()
    })


    it('create blog', async () => {
        const res = await req
            .post('/blogs')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                name: 'name',
                description: 'description',
                websiteUrl: 'https://www.outue.com/'
            })
            .expect(STATUS_CODE.CREATED_201)

        idBlog = res.body.id

        expect(res.body.name).toEqual('name')

    })


    it(' create newPost', async () => {
        const res = await req
            .post('/posts')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                title: 'title',
                shortDescription: 'shortDescription',
                content: 'content',
                blogId: idBlog
            })
            .expect(STATUS_CODE.CREATED_201)

        idPost = res.body.id

        expect(res.body.title).toEqual('title')

    })


    it(" create newComment for exist  post", async () => {
        const res = await req
            .post(`/posts/${idPost}/comments`)
            .set('Authorization', `Bearer ${jwtToken1}`)
            .send({content: 'content for comments for post'})
            .expect(STATUS_CODE.CREATED_201)
        idComent = res.body.id
        //console.log(res.body)

    })
    //Досюда можно коментировать и потом работать с лайками только
    /////////////////////////////////////////////////////////////


/*    it(" create Like for correct coment", async () => {
        await req
            .put(`/comments/${idComent}/like-status`)
            .set('Authorization', `Bearer ${jwtToken1}`)
            .send({likeStatus: 'Like'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })

    it(" create Like for correct coment", async () => {
        await req
            .put(`/comments/${idComent}/like-status`)
            .set('Authorization', `Bearer ${jwtTokenSecond}`)
            .send({likeStatus: 'Dislike'})
            .expect(STATUS_CODE.NO_CONTENT_204)
    })*/

    it(" get coment from authorization user", async () => {
        const res = await req
            .get(`/comments/${idComent}`)
            .set('Authorization', `Bearer ${jwtTokenSecond}`)

            .expect(STATUS_CODE.SUCCESS_200)

        console.log(res.body)
    })

    it(" get coment from NOT authorization user", async () => {
        const res = await req
            .get(`/comments/${idComent}`)

            .expect(STATUS_CODE.SUCCESS_200)

        console.log(res.body)
    })


})