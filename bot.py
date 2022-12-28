import discord
import json
from discord.ext import commands

bot = commands.Bot(command_prefix='!', intents=discord.Intents.all())

@bot.event
async def on_ready():
    print('Logged in as')
    print(bot.user.name)
    print(bot.user.id)
    print('------')
    await bot.change_presence(status=discord.Status.online, activity=None)

@bot.command()
async def ping(ctx):
    await ctx.send('pong')

bot.run(json.load(open('config.json', 'r'))['token'])