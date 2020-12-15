const kebabCase = require('lodash.kebabcase');
const Listr = require('listr');
const degit = require('degit');
const fs = require('fs').promises;
const execa = require('execa');

module.exports = async ({
  input: [projectName],
  flags: { force, noInstall },
}) => {
  if (!projectName) return Promise.reject(new Error('Missing project name.'));

  const dir = kebabCase(projectName.trim());

  const tasks = new Listr([
    {
      title: `Create Project Directory ${dir}`,
      task: async () => {
        await degit('alonronin/react-tailwind-webpack5-boilerplate', {
          force,
        }).clone(dir);

        await fs.rm(`./${dir}/yarn.lock`);
        await fs.rm(`./${dir}/LICENSE`);

        const pkg = JSON.parse(
          await fs.readFile(`./${dir}/package.json`, 'utf-8')
        );

        delete pkg.repository;
        delete pkg.author;

        pkg.name = dir;
        pkg.version = '1.0.0';
        pkg.license = '';

        await fs.writeFile(
          `./${dir}/package.json`,
          JSON.stringify(pkg, null, 2),
          'utf-8'
        );
      },
    },

    {
      title: 'Create .env File.',
      task: async () => fs.copyFile(`./${dir}/.env.example`, `./${dir}/.env`),
    },

    {
      title: 'Installing Dependencies.',
      task: async (ctx, task) => {
        if (noInstall) return task.skip('Skipping yarn install.');

        return await execa(`yarn`, { cwd: dir }).catch((err) => {
          task.skip('You need yarn to install dependencies.');
        });
      },
    },
  ]);

  return tasks.run();
};
