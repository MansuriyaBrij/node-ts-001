import { Request, Response } from 'express';
import { prisma } from '#lib/prisma';
import { date } from 'zod';
import { PostResource } from '#resources/PostResource';
export class AuthController {
  // Register
  public async list(req: Request, res: Response) {
    try {
      // pagination
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const posts = await prisma.post.findMany({
        skip: offset,
        take: limit,
      });

      return res.json({
        success: true,
        message: 'Posts retrieved successfully',
        data: posts,
      });

    } catch (error) {
      return res.json({
        success: false,
        message: 'Posts retrieved successfully',
        data: [],
      });
    }
  }

  // Create Post
  public async create(req: Request, res: Response) {
    const { title, content, published, tags } = req.body;

    try {
       const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        tags,
        author: {
          connect: { id: req?.user?.id }, // userId → author relation
        },
      },
    });

      return res.json({
        success: true,
        message: 'Post created successfully',
        data: PostResource(post),
      });

    } catch (error) {
      return res.json({
        success: false,
        message: 'Internal Server Error',
        // error: error.message,
      });
    }
  }

  // Update Post
  public async update(req: Request, res: Response) {
    // const { id } = req.params;
    const { id, title, content, published, tags } = req.body;

    try {
      const post = await prisma.post.update({
        where: { id: parseInt(id) },
        data: {
          title,
          content,
          published,
          tags: req.body.tags, // Assuming tags are optional
        },
      });

      return res.json({
        success: true,
        message: 'Post updated successfully',
        data: PostResource(post),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        // error: error.message,
      });
    }
  }

  // Get Post Details
  public async details(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }

      return res.json({
        success: true,
        message: 'Post details retrieved successfully',
        data: post,
      });

      
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });

    }
  }

  // Delete Post
  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const post = await prisma.post.findFirst({
        where: { id: parseInt(id) },
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }

      await prisma.post.delete({
        where: { id: parseInt(id) },
      });

      return res.json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }



}

export default new AuthController();
