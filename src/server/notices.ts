import { noticeTitle } from '#/lib/noticeTitle'
import { createServerFn } from '@tanstack/react-start'
import * as cheerio from 'cheerio'

type NoticeSummaryProp = {
  title: string
  date: string
  link: string
  img: string
  postID: number
  typeID: number
}

export const getAllNotices = createServerFn()
  .inputValidator((input: { typeID: number; pageNo?: number }) => input)
  .handler(async ({ data: { typeID, pageNo } }) => {
    try {
      const resolvedPageNo =
        typeof pageNo === 'number' && pageNo > 1 ? pageNo : undefined

      const response = await fetch(
        `${process.env.VITE_EXTERNAL_LINK}/notice?type=${typeID}${resolvedPageNo ? `&page=${resolvedPageNo}` : ''}`,
      )
      const $ = cheerio.load(await response.text())
      const noticeSummaries: NoticeSummaryProp[] = []
      const totalPage = $('.pagination li').length - 2

      $('.slide-single').each((_i, element) => {
        const link = $(element).find('a').attr('href')
        const title = $(element).find('.one-line-limit').text().trim()
        const date = $(element).find('.m-0').text().trim()
        const img = $(element).find('.slide-single-img img').attr('src') || ''

        const url = new URL(link || '')
        const postID = Number(url.searchParams.get('id'))

        if (title && link && postID)
          noticeSummaries.push({ title, date, link, img, postID, typeID })
      })

      return {
        noticeSummaries,
        typeID,
        pageNo: resolvedPageNo ?? 1,
        totalPage,
        noticeTitle: noticeTitle(Number(typeID)),
      }
    } catch (error) {
      console.error('Error in getAllNotices:', error)
      throw error
    }
  })

export const getNotice = createServerFn()
  .inputValidator((id: { typeID: number; postID: number }) => id)
  .handler(async ({ data: { typeID, postID } }) => {
    try {
      const response = await fetch(
        `${process.env.VITE_EXTERNAL_LINK}/news?type=${typeID}&id=${postID}`,
      )
      const $ = cheerio.load(await response.text())

      const mainContainer = $('.row')

      const title = mainContainer.find('.section-title').text().trim()
      const dateText = mainContainer
        .find('p')
        .filter((_i, el) => $(el).text().includes('Publish Date:'))
        .text()
      const date = dateText.replace('Publish Date:', '').trim()
      const img =
        mainContainer.find('.text-center img.img-fluid').attr('src') || ''

      const text = mainContainer
        .find('.text-justify p')
        .map((_i, el) => $(el).text().trim())
        .get()
        .filter((p) => p.length > 0)

      let noticeDetails = {
        title,
        date,
        img,
        text,
        pdf: '',
      }

      const pdfLink = mainContainer.find('iframe').attr('src') || ''
      if (pdfLink) {
        const pdfResponse = await fetch(pdfLink)
        const arrayBuffer = await pdfResponse.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        noticeDetails.pdf =
          'data:application/pdf;base64,' + buffer.toString('base64')
      }

      return noticeDetails
    } catch (error) {
      console.error('Error in getNotice:', error)
      throw error
    }
  })
