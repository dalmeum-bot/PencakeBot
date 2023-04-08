import discord
import random
import os
from pathlib import Path
from urllib.request import urlopen
from urllib.request import Request
from urllib.error import HTTPError
from discord.errors import HTTPException
from json import loads
from keep_alive import keep_alive
from bs4 import BeautifulSoup
from sympy import *

a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z = symbols(
	'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z')

# make
class Pencake(discord.Bot):
	async def on_ready(self):
		print(f'Logged in as {self.user}')

	async def on_member_join(self, member):
		if not member.bot:
			role = discord.utils.get(member.guild.roles, name="User")
			member.add_roles(role)

bot = Pencake()
config = loads(Path('config.json').read_text())

# math commands
MATH = discord.SlashCommandGroup(name='math',
                                 description='math commands',
                                 guild_ids=config['guild_ids'].values())

@MATH.command(description='출력하기')
async def print(ctx, formula: str):
	try:
		await ctx.respond('> `' + formula + '`\n\n```\n' + pretty(eval(formula)) + '\n```')
	except Exception as err:
		await ctx.respond(err)
		return

@MATH.command(description='변수 정의하기')
async def let(ctx, formula: str):
	try:
		exec('global ' + formula.split('=')[0])
		exec(formula)
	except Exception as err:
		await ctx.respond(err)
		return

	await ctx.respond('> `' + formula + '`\n\n' + ':ballot_box_with_check: ')

# BOJ commands
BOJ = discord.SlashCommandGroup(name='boj',
                                description='BOJ commands',
                                guild_ids=config['guild_ids'].values())
tier_names = [
	'Unrated', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ruby'
]
tier_counts = ['V', 'IV', 'III', 'II', 'I']
tier_colors = [
	0x302C2C, 0xA85C1C, 0x4C5C7C, 0xE49C34, 0x6CDCAC, 0x54B4F4, 0xEC3464
]

try:

	@BOJ.command(name='id', description='search BOJ problem')
	async def problem_search(ctx, problem_id: int):
		url = f'https://solved.ac/api/v3/problem/show?problemId={problem_id}'

		try:
			objects = loads(
				BeautifulSoup(urlopen(url).read(), 'html.parser').get_text())
		except HTTPError:
			await ctx.respond(f'**{problem_id}**번 문제를 찾을 수 없습니다.')
			return
		except UnicodeError:
			await ctx.respond('아이디는 유니코드가 들어가지 않습니다.')
			return
		except:
			await ctx.respond('알 수 없는 오류가 발생했습니다.')
			return

		problem = {
			"id"        :
				objects['problemId'],
			"title"     :
				objects['titleKo'],
			"tier"      :
				tier_names[0] if objects['level'] == 0 else
				tier_names[(objects['level'] - 1) // 5 + 1] + ' ' +
				tier_counts[(objects['level'] - 1) % 5],
			"tier_icon" :
				f"https://static.solved.ac/tier_small/{objects['level']}.svg",
			"tier_color":
				tier_colors[0] if objects['level'] == 0 else
				tier_colors[(objects['level'] - 1) // 5 + 1],
			"tags"      : [x['displayNames'][0]['name'] for x in objects['tags']]
		}

		embed = discord.Embed(
			title=problem['id'],
			description=problem['title'],
			url=f"https://www.acmicpc.net/problem/{problem['id']}",
			color=problem['tier_color'])

		embed.add_field(name="Tier", value=problem['tier'], inline=False)
		if problem['tags']:
			embed.add_field(name="Tags", value='\n'.join(problem['tags']))

		class Button(discord.ui.View):

			def __init__(self, *items):
				super().__init__(*items)
				self.count = 0

			@discord.ui.button(label=f"{problem['id']}번 펼치기",
			                   style=discord.ButtonStyle.gray)
			async def info(self, button, interaction):
				if self.count % 2 == 0:
					button.label = f"{problem['id']}번 접기"

					info = discord.Embed(
						title=problem['id'],
						description=problem['title'],
						url=f"https://www.acmicpc.net/problem/{problem['id']}",
						color=problem['tier_color'])

					req = Request(
						f"https://www.acmicpc.net/problem/{objects['problemId']}",
						headers={'User-Agent': 'Mozila/5.0'})
					webpage = urlopen(req)
					soup = BeautifulSoup(webpage, features="html.parser")

					problem['info'] = {
						"problem_description":
							soup.find('div', id='problem_description').text.strip(),
						"problem_input"      :
							soup.find('div', id='problem_input').text.strip(),
						"problem_output"     :
							soup.find('div', id='problem_output').text.strip(),
						"sample_inputs"      : [],
						"sample_outputs"     : []
					}

					count = 1
					while soup.find('pre', id=f'sample-output-{count}') is not None:
						problem['info']['sample_inputs'].append(
							soup.find('pre', id=f'sample-input-{count}').text)
						problem['info']['sample_outputs'].append(
							soup.find('pre', id=f'sample-output-{count}').text)
						count += 1

					info.add_field(name="Tier", value=problem['tier'], inline=False)
					info.add_field(
						name="Problem",
						value=f"```\n{problem['info']['problem_description']}\n```",
						inline=False)
					info.add_field(name="Input",
					               value=f"```\n{problem['info']['problem_input']}\n```",
					               inline=False)
					info.add_field(
						name="Output",
						value=f"```\n{problem['info']['problem_output']}\n```",
						inline=False)

					for index in range(len(problem['info']['sample_inputs'])):
						info.add_field(
							name=f"Sample Input {index + 1}",
							value=f"```\n{problem['info']['sample_inputs'][index]}\n```",
							inline=False)
						info.add_field(
							name=f"Sample Output {index + 1}",
							value=f"```\n{problem['info']['sample_outputs'][index]}\n```",
							inline=False)

					if problem['tags']:
						info.add_field(name="Tags",
						               value='\n'.join(problem['tags']),
						               inline=False)

					await interaction.response.edit_message(embed=info, view=self)
				else:
					button.label = f"{problem['id']}번 펼치기"
					await interaction.response.edit_message(embed=embed, view=self)

				self.count += 1

		await ctx.respond(embed=embed, view=Button())

	@BOJ.command(name='user', description='search BOJ user')
	async def user_search(ctx, user_name: str):
		url = f'https://solved.ac/api/v3/search/user?query={user_name}'

		try:
			objects = loads(
				BeautifulSoup(urlopen(url).read(),
				              'html.parser').get_text())['items'][0]
		except IndexError:
			await ctx.respond(f'**{user_name}**라는 아이디를 가진 유저를 찾을 수 없습니다.')
			return
		except UnicodeError:
			await ctx.respond('아이디는 유니코드가 들어가지 않습니다.')
			return
		except:
			await ctx.respond('알 수 없는 오류가 발생했습니다.')
			return

		user = {
			"name"         :
				objects['handle'],
			"bio"          :
				objects['bio'],
			"organizations": [_x['name'] for _x in objects['organizations']],
			"profile_image":
				objects['profileImageUrl'],
			"solved_count" :
				objects['solvedCount'],
			"rating"       :
				objects['rating'],
			"tier"         :
				'Master' if objects['tier'] == 31 else
				tier_names[(objects['tier'] - 1) // 5 + 1] + ' ' +
				tier_counts[(objects['tier'] - 1) % 5],
			"tier_color"   :
				random.choice(
					[0xd989c1, 0xa0e4fc, 0xa6c0fb, 0xe685b5, 0xaca0fb, 0xb494f4]) if
				objects['tier'] == 31 else tier_colors[(objects['tier'] - 1) // 5 + 1],
			"rank"         :
				objects['rank']
		}

		embed = discord.Embed(title=user['name'],
		                      description=user['bio'],
		                      url=f"https://solved.ac/profile/{user['name']}",
		                      color=user['tier_color'])

		embed.add_field(name="Tier", value=user['tier'])
		embed.add_field(name="Rating", value=user['rating'])
		embed.add_field(name="Rank", value=f"#{user['rank']}")

		if user['profile_image']:
			embed.set_thumbnail(url=user['profile_image'])
		if user['organizations']:
			embed.add_field(name="Organization",
			                value='\n'.join(user['organizations']),
			                inline=False)

		await ctx.respond(embed=embed)
except Exception as error:
	print(error)

bot.add_application_command(BOJ)
bot.add_application_command(MATH)

keep_alive()

try:
	bot.run(config['token'])
except HTTPException:
	print("\n\n\nBLOCKED BY RATE LIMITS\nRESTARTING NOW\n\n\n")
	os.system('kill 1')
	os.system("python restarter.py")
